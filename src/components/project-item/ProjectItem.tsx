import { useFetch } from "@/hooks/useFetch";
import { apiUrl } from "@/utils/apiUrl";
import { projectItemProps } from "@/utils/types";
import { EllipsisHorizontalIcon, LinkIcon } from "@heroicons/react/24/outline";
import React from "react";

const ProjectItem = (props: projectItemProps) => {
  const response = useFetch(`${apiUrl}/product/all`);

  const renderProductNumber = () => {
    if (props._id === "inventory-items") {
      return <p>{response?.data?.meta?.total}</p>;
    }
    return <p>{props.createdAt}</p>;
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="bg-primary flex flex-row main-border gap-4 p-4 rounded-lg">
        <div className="flex-1 flex flex-row items-center space-x-4">
          <div className="avatar h-10 w-10 flex-shrink-0 rounded-full bg-zinc-900 dark:bg-zinc-500 grid items-center justify-center content-center main-border">
            {<props.Icon height={24} width={24} className={"text-white"} />}
          </div>
          <div className="flex flex-col">
            <p className="heading-text font-semibold">{props.name}</p>
            <div className="flex flex-row items-center text-xs text-slate-500 space-x-1 font-medium">
              <div className="">{renderProductNumber()}</div>
              <p className="text-md">&bull;</p>
              <p
                className={
                  props.status === "failed"
                    ? "text-red-500 "
                    : "text-green-500 "
                }
              >
                {props.branch}
              </p>
            </div>
          </div>
        </div>
        <button>
          <EllipsisHorizontalIcon height={20} width={20} />
        </button>
      </div>
    </div>
  );
};

export default ProjectItem;
