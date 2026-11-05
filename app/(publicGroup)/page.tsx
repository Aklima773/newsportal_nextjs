import { Button } from "@/components/ui/button";
import { getMe } from "@/service/getMe";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  // const user = await getMe();

  
  return (
  <div>
    Hello Nextjs

<Button size={"sm"}>
  Click me
</Button>
  </div>
  );
}
