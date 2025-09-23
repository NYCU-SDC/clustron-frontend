import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob, type JobCreatePayload } from "@/lib/request/jobs";

export function useCreateJob() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: JobCreatePayload) => createJob(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["job-counts"] });
    },
  });
}
