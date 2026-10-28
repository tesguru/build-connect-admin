import { Suspense } from "react";
import CreateNewPassword from '@/components/Pages/Auth/CreateNewPassword/CreateNewPassword'
import { PageLoader } from '@/components/ui/Custom/LoadingState'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading..." />}>
      <CreateNewPassword />
    </Suspense>
  );
}
