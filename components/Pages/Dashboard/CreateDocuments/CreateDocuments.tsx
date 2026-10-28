import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { URLS } from '@/libs/constants/pageurl';
import BackButton from '@/components/ui/BackButton';
import { Spinner } from '@/components/ui/Custom/LoadingState';
import Button from '@/components/ui/Button/Button';
import { useProjects } from '@/libs/hooks/useProjects';
import { UserDetailsProps } from '../UserDetails/UserDetails';
import { uploadFile } from '@/libs/utils/fileUpload';

interface Document {
  fileId: string;
  type: string;
  description: string;
}

export default function CreateDocuments({ id }: UserDetailsProps) {
  const { createMilestoneMutation } = useProjects();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  const methods = useForm({
    defaultValues: {},
    mode: "onChange"
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  // Get file type from MIME type
  const getFileType = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    return 'file';
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const result = await uploadFile(file, 'milestone_document', `Document: ${file.name}`);
        
        if (result.success && result.fileId) {
          const newDocument: Document = {
            fileId: result.fileId,
            type: getFileType(file.type),
            description: file.name
          };
          
          setDocuments(prev => [...prev, newDocument]);
        }
      } catch (error) {
        console.error('File upload failed:', error);
      }
    }
    
    setUploading(false);
    event.target.value = '';
  };

  // Remove a document
  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    return <File className="h-5 w-5" />;
  };

  const onSubmit = () => {
    // Submit only the documents array
    createMilestoneMutation.mutate({ 
      projectId: id, 
      documents: documents 
    });
  };

  const handleCancel = () => {
    setDocuments([]);
    reset();
  };

  return (
    <FormProvider {...methods}>
      <DashboardLayout urlpath={URLS.DASHBOARD.MILESTONES}>
        <BackButton/>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Upload Documents
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Document Upload Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents
              </label>
              
              {/* Upload Area */}
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            {documents.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Documents to Upload ({documents.length})
                </h3>
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div
                      key={doc.fileId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Type: {doc.type} • ID: {doc.fileId.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Spinner className="h-4 w-4" />
                <span>Uploading documents...</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button 
              type="submit"
              loading={createMilestoneMutation?.isPending}
              disabled={documents.length === 0 || createMilestoneMutation?.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Submit Documents
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DashboardLayout>
    </FormProvider>
  );
}