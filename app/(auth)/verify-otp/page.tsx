import { Suspense } from "react";
import VerifyOtp from '@/components/Pages/Auth/VerifyOtp/VerifyOtp'
import { PageLoader } from '@/components/ui/Custom/LoadingState'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading..." />}>
      <VerifyOtp />
    </Suspense>
  );
}
