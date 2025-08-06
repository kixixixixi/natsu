import React, { FC } from "react"
import Piano from "./components/Piano"

const Page: FC = ({ ...props }) => {
  return <Piano {...props} />
}

export default Page
