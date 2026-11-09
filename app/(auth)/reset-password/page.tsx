import { Suspense } from "react";
import ResetPassword from '@/components/Pages/Auth/ResetPassword/ResetPassword'
import { PageLoader } from '@/components/ui/Custom/LoadingState'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading..." />}>
      <ResetPassword />
    </Suspense>
  );
}