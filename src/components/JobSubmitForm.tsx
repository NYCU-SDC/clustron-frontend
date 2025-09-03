import { useState } from "react";
import {
  IoIosRemoveCircleOutline,
  IoIosAddCircleOutline,
} from "react-icons/io";
import { useTranslation } from "react-i18next";

export default function JobSubmitForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    jobName: "",
    comment: "",
    scriptPath: "",
    cwd: "",
    partition: "",
    tasks: "",
    cpus: "",
    memPerCpu: "",
    nodes: "",
    memPerNode: "",
    timeLimit: "",
    stdin: "",
    stdout: "",
    stderr: "",
    command: "",
  });

  const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnvChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setEnvVars((prev) => {
      const newVars = [...prev];
      newVars[index][field] = value;
      return newVars;
    });
  };

  const addEnvVar = () => {
    setEnvVars((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    console.log("Environment Variables: ", envVars);
  };

  return (
    <form onSubmit={handleSubmit} className=" flex min-h-screen bg-white">
      {/*left sidebar*/}
      <div className="min-w-xs border-r">
        <aside className="sticky top-[7rem] self-start min-w-48 ml-15 my-8">
          <div className="text-4xl font-semibold mb-8">
            {t("jobSubmitForm.sidebarTitle")}
          </div>
          <ul className="space-y-4">
            <li>{t("jobSubmitForm.sidebarList.list")}</li>
            <li>{t("jobSubmitForm.sidebarList.submit")}</li>
          </ul>
        </aside>
      </div>

      {/*right submit form*/}
      <div className="flex-1 flex justify-center">
        <div className="min-w-2xl max-w-2xl px-6 py-8 flex flex-col">
          <h2 className="font-semibold text-2xl mb-2">
            <b>{t("jobSubmitForm.basicInfoTitle")}</b>
          </h2>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.jobNameLabel")}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="jobName"
              type="text"
              value={formData.jobName}
              onChange={handleChange}
              placeholder={t("jobSubmitForm.jobNamePlaceholder")}
              className="w-[70%] border rounded-md p-2"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.commentLabel")}
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full border rounded-md p-2 h-25"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.scriptPathLabel")}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="scriptPath"
              value={formData.scriptPath}
              onChange={handleChange}
              placeholder={t("jobSubmitForm.scriptPathPlaceholder")}
              className="w-full border rounded-md p-2 h-25"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.cwdLabel")}
            </label>
            <textarea
              name="cwd"
              value={formData.cwd}
              onChange={handleChange}
              placeholder={t("jobSubmitForm.cwdPlaceholder")}
              className="w-full border rounded-md p-2 h-25"
            />
          </div>

          <h2 className="font-semibold text-2xl mb-2">
            <b>{t("jobSubmitForm.envSettingTitle")}</b>
          </h2>

          <div className="mb-2">
            <div className="grid grid-cols-3 gap2 mb-2">
              <span className="font-medium">
                {t("jobSubmitForm.envVariable")}
              </span>
              <span className="font-medium">{t("jobSubmitForm.envValue")}</span>
            </div>
            <div>
              {envVars.map((env, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={t("jobSubmitForm.envVarPlaceholder")}
                    className="border rounded-md p-2"
                    value={env.key}
                    onChange={(e) =>
                      handleEnvChange(index, "key", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder={t("jobSubmitForm.envValPlaceholder")}
                    className="border rounded-md p-2"
                    value={env.value}
                    onChange={(e) =>
                      handleEnvChange(index, "value", e.target.value)
                    }
                  />
                  <div className="flex items-center">
                    {index === envVars.length - 1 ? (
                      <IoIosAddCircleOutline
                        className="text-green-400 cursor-pointer"
                        size={20}
                        onClick={addEnvVar}
                      />
                    ) : (
                      <IoIosRemoveCircleOutline
                        className="text-red-400 cursor-pointer"
                        size={20}
                        onClick={() => removeEnvVar(index)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-semibold text-2xl mb-2">
            <b>{t("jobSubmitForm.resourcesTitle")}</b>
          </h2>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.partitionLabel")}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="partition"
              value={formData.partition}
              onChange={handleChange}
              className="w-[40%] border rounded-md p-2"
            >
              <option value="">
                {t("jobSubmitForm.partitionPlaceholder")}
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.tasksLabel")}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="tasks"
              type="text"
              value={formData.tasks}
              onChange={handleChange}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.cpusLabel")}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="cpus"
              type="text"
              value={formData.cpus}
              onChange={handleChange}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.memPerCpuLabel")}
            </label>
            <input
              name="memPerCpu"
              type="text"
              value={formData.memPerCpu}
              onChange={handleChange}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.nodesLabel")}
            </label>
            <input
              name="nodes"
              type="text"
              value={formData.nodes}
              onChange={handleChange}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.memPerNodeLabel")}
            </label>
            <input
              name="memPerNode"
              type="text"
              value={formData.memPerNode}
              onChange={handleChange}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.timeLimitLabel")}
            </label>
            <input
              name="timeLimit"
              type="text"
              value={formData.timeLimit}
              onChange={handleChange}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <h2 className="font-semibold text-2xl mb-2">
            <b>{t("jobSubmitForm.ioSettingTitle")}</b>
          </h2>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.stdinLabel")}
            </label>
            <input
              name="stdin"
              type="text"
              value={formData.stdin}
              onChange={handleChange}
              placeholder={t("jobSubmitForm.stdinPlaceholder")}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.stdoutLabel")}
            </label>
            <input
              name="stdout"
              type="text"
              value={formData.stdout}
              onChange={handleChange}
              placeholder={t("jobSubmitForm.stdoutPlaceholder")}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <div className="mb-2">
            <label className="block text-base font-medium mb-1">
              {t("jobSubmitForm.stderrLabel")}
            </label>
            <input
              name="stderr"
              type="text"
              value={formData.stderr}
              onChange={handleChange}
              placeholder={t("jobSubmitForm.stderrPlaceholder")}
              className="w-[70%] border rounded-md p-2 h-11"
            />
          </div>

          <h2 className="font-semibold text-2xl mb-2">
            <b>{t("jobSubmitForm.commandPreviewTitle")}</b>
          </h2>

          <div className="mb-2">
            <textarea
              name="command"
              value={formData.command}
              onChange={handleChange}
              placeholder={t("jobSubmitForm.commandPlaceholder")}
              className="w-full border rounded-md p-2 h-25"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 h-11 rounded-md"
              >
                {t("jobSubmitForm.submitButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
