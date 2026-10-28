import React from 'react';
import { Target, Calendar } from 'lucide-react';
import { NairaIcon } from '@/components/ui/Custom/NairaIcon';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { URLS } from '@/libs/constants/pageurl';
import BackButton from '@/components/ui/BackButton';
import IconInputField from '@/components/ui/Forms/IconInputField';
import DatePicker from '@/components/ui/Forms/Datepicker';
import IconTextarea from '@/components/ui/Forms/IconTextArea';

import Button from '@/components/ui/Button/Button';
import { MilestoneFormData, milestoneSchema } from '@/libs/schema/projectschema';
import { useProjects } from '@/libs/hooks/useProjects';
import { UserDetailsProps } from '../UserDetails/UserDetails';

export default function CreateMilestoneForm({ id }: UserDetailsProps) {
  const { createMilestoneMutation } = useProjects();

  const methods = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      name: '',
      description: '',
      completionDate: '',
      amount: ''
    },
    mode: "onChange"
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = methods;

  const onSubmit = (data: MilestoneFormData) => {
 
  const submitData = {
    name: data.name,
    description: data.description,
    completionDate: data.completionDate,
    amount: Number(data.amount)
  };
  
  createMilestoneMutation.mutate({ 
    projectId: id, 
    milestoneData: submitData 
  });
};

  const handleCancel = () => {
    reset();
  };

  return (
    <FormProvider {...methods}>
      <DashboardLayout urlpath={URLS.DASHBOARD.MILESTONES}>
        <BackButton/>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Create Milestone
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: Milestone Name and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <IconInputField
                  label="Milestone Name"
                  id="name"
                  placeholder="e.g., Foundation Completion"
                  icon={<Target />}
                  error={errors.name?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <IconInputField
                  label="Amount"
                  id="amount"
                  placeholder="1,000,000"
                  icon={<NairaIcon className="w-5 h-5" />}
                  error={errors.amount?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>

          {/* Row 2: Completion Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="completionDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Completion Date"
                  placeholder="Select completion date"
                  error={errors.completionDate?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>

          {/* Row 3: Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <IconTextarea
                label="Description"
                id="description"
                placeholder="Enter milestone description..."
                rows={6}
                error={errors.description?.message}
                required
                {...field}
              />
            )}
          />

          {/* Buttons */}
          <div className="flex gap-4">
            <Button 
              type="submit"
              loading={createMilestoneMutation?.isPending}
              disabled={!isValid || createMilestoneMutation?.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Create Milestone
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