// pages/AddDocuments.tsx
import React, { useMemo } from "react";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { URLS } from "@/libs/constants/pageurl";
import BackButton from "@/components/ui/BackButton";
import InputField from "@/components/ui/Forms/InputField";
import FileUploadComponent from "@/components/ui/Forms/FileUploadComponent";
import { Dropdownsearch } from "@/components/ui/Forms/Dropdownsearch";
import Button from "@/components/ui/Button/Button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useProjects } from "@/libs/hooks/useProjects";
import { useDocuments } from "@/libs/hooks/useDocuments";
import { FileIcon } from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "@/libs/store/Authstore";

// ── Document Types ────────────────────────────────────────────────────────────
const DOCUMENT_TYPES = [
  { value: "profile_picture",      label: "Profile Picture" },
  { value: "business_license",     label: "Business License" },
  { value: "insurance_document",   label: "Insurance Document" },
  { value: "certification",        label: "Certification" },
  { value: "work_showcase",        label: "Work Showcase" },
  { value: "id_document",          label: "ID Document" },
  { value: "income_verification",  label: "Income Verification" },
  { value: "portfolio",            label: "Portfolio" },
];

// ── Schema ────────────────────────────────────────────────────────────────────
const documentSchema = z.object({
  documentName: z
    .string()
    .min(1, "Document name is required")
    .max(100, "Must be under 100 characters"),

  type: z
    .string()
    .min(1, "Document type is required"),

  description: z
    .string()
    .max(500, "Must be under 500 characters")
    .optional(),

  // ✅ empty string → undefined so uuid() never sees ""
  projectId: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .pipe(z.string().uuid("Invalid project").optional()),

  // ✅ z.any() avoids SSR crash from z.instanceof(File)
  file: z
    .object({
      file: z.any(),
      uri: z.string(),
      name: z.string(),
      type: z.string(),
      size: z.number(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .nullable()
    .refine((val) => !!val, { message: "File is required" }),
});

type DocumentFormInput = z.infer<typeof documentSchema>;

// ── Component ─────────────────────────────────────────────────────────────────
export default function AddDocuments() {
  const router = useRouter();

  // ── Projects for dropdown ─────────────────────────────────────────────────
  const { projectsQuery } = useProjects();
  const { data: projectsData, isLoading: projectsLoading } = projectsQuery({
    page: 1,
    limit: 100,
  });

  const projectOptions = useMemo(
    () =>
      (projectsData?.data?.data?.items || []).map((p: any) => ({
        value: p.id,
        label: p.title,
      })),
    [projectsData]
  );

  // ── Form ──────────────────────────────────────────────────────────────────
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentFormInput>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentName: "",
      type:         "",
      description:  "",
      projectId:    undefined,
      file:         null,
      
    },
  });

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { addDocumentMutation } = useDocuments();
  const { users, authToken } = useAuthStore();

  const onSubmit = (data: DocumentFormInput) => {
    if (!data.file) return;

    addDocumentMutation.mutate(
      {
        file: data.file,
      
        formValues: {
            userId: users?.id,
          type:         data.type,
          originalName: data.documentName,
          description:  data.description,
          projectId:    data.projectId,
       
          metadata:     {},
        },
      },
      {
        onSuccess: () => {
          reset();
          router.back();
        },
      }
    );
  };

  // ✅ Logs exactly which field blocks submission
  const onError = (errs: any) => {
    console.log("❌ Validation errors:", errs);
  };

  const isLoading = addDocumentMutation.isPending;

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout urlpath={URLS.DASHBOARD.DOCUMENTS}>
      <BackButton />

      <div className="mb-8">
        <p className="text-2xl font-bold">Add Document</p>
        <p className="text-sm text-gray-500 mt-1">
          Upload a new document and optionally associate it with a project.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="border border-gray-300 p-6 rounded-xl space-y-5">

          {/* ── Row 1: Name + Type ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Document Name"
              id="documentName"
              placeholder="e.g., Final Contract Q1"
              error={errors.documentName?.message}
              {...register("documentName")}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Dropdownsearch
                  label="Document Type"
                  id="type"
                  options={DOCUMENT_TYPES}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select document type"
                  searchable
                  width="full"
                  error={errors.type?.message}
                />
              )}
            />
          </div>

          {/* ── Row 2: Description ── */}
          <InputField
            label="Description"
            id="description"
            placeholder="Brief description of the document (optional)"
            error={errors.description?.message}
            {...register("description")}
          />

          {/* ── Row 3: Project (optional) ── */}
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Dropdownsearch
                label="Associate with Project (optional)"
                id="projectId"
                options={projectOptions}
                value={field.value ?? ""}
                onChange={(val) => field.onChange(val || undefined)}
                placeholder={
                  projectsLoading ? "Loading projects..." : "Select a project"
                }
                searchable
                searchPlaceholder="Search projects..."
                width="full"
                disabled={projectsLoading}
                error={errors.projectId?.message}
                helperText="Link this document to an existing project"
              />
            )}
          />

          {/* ── Row 4: File Upload ── */}
          <FileUploadComponent
            control={control}
            name="file"
            label="Upload Document"
            title="Click to upload"
            note="PNG, JPG, PDF, DOCX (max. 10MB)"
            icon={<FileIcon className="w-10 h-10 text-gray-400" />}
            maxSizeMB={10}
            accept="image/*,.pdf,.doc,.docx"
            error={errors.file?.message as string}
          />

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="border border-gray-400 bg-gray-100 text-black hover:bg-gray-200"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={isLoading}
              className="text-white bg-primary-02 hover:bg-primary min-w-[100px]"
            >
              Submit
            </Button>
          </div>

        </div>
      </form>
    </DashboardLayout>
  );
}