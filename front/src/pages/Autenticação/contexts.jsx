import Axios from "axios";
import { useEffect, useState } from "react";
export default function Autenticar(props) {
    const [context, setContext] = useState(false);

    Axios.post('http://localhost:3001/login/auth', {
        email: "eduardosieglitz2005@gmail.com",
        senha: "123ss5678",
    }).then((res) => {
        setContext(res.data.Login);
    }).catch((erro) => {
        setContext(erro.data.Login);
    });
    return (context);
}
