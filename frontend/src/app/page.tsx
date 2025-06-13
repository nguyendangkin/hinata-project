import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "antd";

export default function Home() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Hello Ant Design</h1>
            <Button type="primary">Primary Button</Button>
        </main>
    );
}
