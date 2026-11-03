import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://buildconnect-admin-api.ivantage.africa/v1/';

if (!API_URL) {
  console.warn("⚠️ NEXT_PUBLIC_API_URL is not configured!");
}

// Encode path segments safely
const sanitizePath = (segments: string[]) =>
  segments.map((segment) => encodeURIComponent(segment)).join('/');

// Filter headers for outgoing request to backend
const filterRequestHeaders = (headers: Headers) => {
  const filtered: Record<string, string> = {};
  headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!['content-length', 'content-encoding', 'host', 'content-type'].includes(lowerKey)) {
      filtered[key] = value;
    }
  });
  return filtered;
};

// Handle backend response safely
const handleResponse = async (res: Response) => {
  const headers = new Headers(res.headers);
  headers.delete('content-encoding');
  headers.delete('transfer-encoding');

  const contentType = res.headers.get('content-type') || 'application/json';

  if (contentType.includes('application/json')) {
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: Object.fromEntries(headers.entries()),
    });
  }

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: Object.fromEntries(headers.entries()),
  });
};

// Error message helper
const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown proxy error';

// Generic request handler
const handleRequest = async (
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
) => {
  try {
    if (!API_URL) throw new Error('API URL not configured');
    const resolvedParams = await params;
    const pathSegment = sanitizePath(resolvedParams.path);
    
    // Get the raw request URL to check for trailing slash
    const rawUrl = request.url;
    const urlBeforeQuery = rawUrl.split('?')[0];
    const hasTrailingSlashInRequest = urlBeforeQuery.endsWith('/') && !urlBeforeQuery.endsWith('/api/proxy/');
    
    // Always add trailing slash for the backend if there are query params
    // This is because your Django backend expects it
    const hasQueryParams = request.nextUrl.searchParams.size > 0;
    const shouldAddTrailingSlash = hasTrailingSlashInRequest || hasQueryParams;
    
    console.log('=== DEBUG INFO ===');
    console.log('Raw URL:', rawUrl);
    console.log('Has query params:', hasQueryParams);
    console.log('Adding trailing slash:', shouldAddTrailingSlash);
    console.log('==================');
    
    // Build backend URL preserving the trailing slash
    const backendUrl = new URL(`${API_URL}${pathSegment}${shouldAddTrailingSlash ? '/' : ''}`);

    // Forward query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const filteredHeaders = filterRequestHeaders(request.headers);
    console.log(`Proxying ${method} to:`, backendUrl.toString());

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: filteredHeaders,
      cache: 'no-store',
    };

    // Add body for POST, PATCH, PUT
    if (['POST', 'PATCH', 'PUT'].includes(method)) {
      const body = await request.json();
      fetchOptions.headers = {
        ...filteredHeaders,
        'Content-Type': 'application/json',
      };
      fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(backendUrl.toString(), fetchOptions);
    return handleResponse(res);
  } catch (error) {
    console.error(`Proxy ${method} error:`, error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
};

// GET handler
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'GET');
}

// POST handler
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'POST');
}

// PATCH handler
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'PATCH');
}

// DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'DELETE');
}

// PUT handler
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'PUT');
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  });
}