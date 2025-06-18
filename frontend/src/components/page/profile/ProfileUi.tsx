"use client";

import { reqGetProfileUser } from "@/util/actions";
import { handleApiCall } from "@/util/clientRequestHandler";
import request from "@/util/request";
import { useEffect } from "react";

export default function ProfileUi() {
    // useEffect(() => {
    //     const callApi = async () => {
    //         const result = await handleApiCall(reqGetProfileUser({}));
    //         console.log(result);
    //     };
    //     callApi();
    // }, []);
    console.log("hello");
    return <div>xin chào profile nhé</div>;
}
