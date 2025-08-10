import React from "react";

export const IntroductionText = (props: { content: string }): JSX.Element => {
  return <p className="text-gray-50 text-heading1Bold">{props.content}</p>;
};
