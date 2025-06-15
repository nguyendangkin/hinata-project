import { auth } from "@/auth";
import HeaderUi from "@/components/layout/header/HeaderUi";

export default async function HeaderLayout() {
    const session = await auth();
    console.log("check session", session?.user.displayName);
    return <HeaderUi session={session} />;
}
