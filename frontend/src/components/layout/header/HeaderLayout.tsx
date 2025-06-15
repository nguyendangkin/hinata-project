import { auth } from "@/auth";
import HeaderUi from "@/components/layout/header/HeaderUi";

export default async function HeaderLayout() {
    const session = await auth();

    return <HeaderUi session={session} />;
}
