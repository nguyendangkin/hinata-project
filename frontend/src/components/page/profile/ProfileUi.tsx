"use client";

import { reqGetProfileUser } from "@/util/actions";
import request from "@/util/request";
import { useEffect } from "react";

export default function ProfileUi() {
    useEffect(() => {
        const callApi = async () => {
            const result = await reqGetProfileUser({});
            console.log(result);
        };
        callApi();
    }, []);
    return <div>xin chào profile nhé</div>;
}
