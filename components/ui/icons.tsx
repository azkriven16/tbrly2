import { ComponentProps } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaGithub, FaGoogle } from "react-icons/fa";

export const Icons = {
  spinner: (props: ComponentProps<"svg">) => (
    <AiOutlineLoading3Quarters {...props} />
  ),
  gitHub: (props: ComponentProps<"svg">) => <FaGithub {...props} />,
  google: (props: ComponentProps<"svg">) => <FaGoogle {...props} />,
};
