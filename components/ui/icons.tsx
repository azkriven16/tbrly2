import { FaGithub, FaGoogle, FaSpinner } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ComponentProps } from "react";

export const Icons = {
  spinner: (props: ComponentProps<"svg">) => (
    <AiOutlineLoading3Quarters {...props} />
  ),
  gitHub: (props: ComponentProps<"svg">) => <FaGithub {...props} />,
  google: (props: ComponentProps<"svg">) => <FaGoogle {...props} />,
};
