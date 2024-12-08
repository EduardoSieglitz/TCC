import React, { useEffect, useRef, useState } from 'react';
import styles from './usuario.module.css';
import { FaRegCircleUser, FaTrash, FaPen, FaEye, FaXmark, FaCheck } from 'react-icons/fa6';
import Footer from '../../../../components/Footer/footer';
import Navbar from '../../../../components/navbar';
import { useForm } from "react-hook-form";
import { useAuth } from '../../../../context/AuthProvider/useAuth';
import validator from 'validator';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function UserTable() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const senha = watch("senha");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [showConfirmAccountDelete, setShowConfirmAccountDelete] = useState(false);
  const [showInformation, setShowInformation] = useState(false);
  const [showEditInformation, setShowEditInformation] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [showRegCliente, setShowRegCliente] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showRegFunc, setShowRegFunc] = useState(false);
  const [showConfirmCad, setShowConfirmCad] = useState(false);
  const [Guardadados, setGuardaDados] = useState();
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [userLevelFilter, setUserLevelFilter] = useState("");
  const auth = useAuth();

  async function dados(data) {
    try {
      const request = await axios.post("http://localhost:3001/registrar", data);
      if (request.data == "Cadastrado") {
        setError("");
        handleClose();
        handleAcaoConcluida();
      } else if (request.data == "Email") {
        setError("Email já existe");
      } else if (request.data == "Telefone") {
        setError("Telefone já existe");
      } else if (request.data == "CPF") {
        setError("CPF já existe");
      } else {
        setError("");
      }
    } catch {
      console.log("Error")
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tabelausuario');
      setUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  async function dadosFunc(event) {
    try {
      const request = await axios.post("http://localhost:3001/registrarfunc", {
        nome: event.nome,
        email: event.email,
        senha: event.senha,
        cpf: event.cpf,
        telefone: event.telefone,
        descricao: event.descricao
      });
      if (request.data == "Cadastrado") {
        handleAcaoConcluida();
      } else if (request.data == "Email") {
        setError("Email já existe");
      } else if (request.data == "Telefone") {
        setError("Telefone já existe");
      } else if (request.data == "CPF") {
        setError("CPF já existe");
      } else {
        setError("");
      }
    } catch (error) {
      console.log("Error: " + error)
    }
  }

  // Excluir usuário
  const handleDelete = async (user) => {
    console.log(user)
    try {
      const endpoint = user.nivelUser === "Clien"
        ? `http://localhost:3001/delete/${editUserId}/${user.idUsuario}`
        : `http://localhost:3001/deletefuncionario/${editUserId}/${user.idUsuario}`;
      const response = await axios.post(endpoint, { email: user.email, senha: user.senha });
      if (response.data == 'Deletado com sucesso.') {
        handleAcaoConcluida();
      } else {
        setError(response.data);
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  // Salvar alterações feitas no EDITAR
  const handleSave = async (data) => {
    try {
      const response = await axios.put(`http://localhost:3001/editarusuario/${editUserId}`, data);
      if (response.data == "Atualizado") {
        handleAcaoConcluida();
      } else if (response.data == "Email") {
        setError("Email já existe");
      } else {
        setError("Telefone já existe");
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  // Filtragem dos usuários conforme nível e pesquisa
  const filteredUsers = users.filter(user =>
    (userLevelFilter ? user.nivelUser === userLevelFilter : true) &&
    (searchValue
      ? (user.nomec?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.nomef?.toLowerCase().includes(searchValue.toLowerCase()))
      : true)
  );

  const handleNext = (data) => {
    setGuardaDados(data);
    setCurrentStep(2);
  };

  const handleFinalSubmit = (data) => {
    const finalData = { ...Guardadados, ...data };
    dados(finalData);
  };

  // Fechar popup's
  const handleClose = () => {
    setShowRegCliente(false);
    setShowRegFunc(false);
    setShowConfirmCad(false);
    setShowEditInformation(false);
    setShowConfirmAccountDelete(false);
    setShowInformation(false);
    setValue("nome", '');
    setValue("email", '');
    setValue("telefone", '');
    setValue("cpf", '');
    setValue("rua", '');
    setValue("bairro", '');
    setValue("cidade", '');
    setValue("cep", '');
    setValue("estado", '');
    setValue("numero", '');
    setValue("descricao", '');
    setValue("senha", '');
    setValue("confirmarSenha", '');
    setError("");
  }

  // Exibe POPUP de INFORMAÇÕES do usuário
  const showInformations = (user) => {
    setSelectedUser(user);
    setShowInformation(true);
    // Preenche o formulário com os dados do usuário
    setValue("nome", user.nivelUser === "Clien" ? user.nomec : user.nomef);
    setValue("email", user.nivelUser === "Clien" ? user.emailc : user.emailf);
    setValue("telefone", user.nivelUser === "Clien" ? user.telefonec : user.telefonef);
    setValue("cpf", user.nivelUser === "Clien" ? user.cpfClien : user.cpfFunc);

    if (user.nivelUser === "Clien") {
      setValue("rua", user.rua);
      setValue("bairro", user.bairro);
      setValue("cidade", user.cidade);
      setValue("cep", user.cep);
      setValue("estado", user.estado);
      setValue("numero", user.numero);
    } else {
      setValue("descricao", user.descricao);
    }
  };

  // Exibe POPUP de EDIÇÃO de informações do usuário
  const editInformations = (user) => {
    setShowEditInformation(true);
    setSelectedUser(user);
    setEditUserId(user.nivelUser === "Clien" ? user.idCliente : user.idFuncionario)
    setValue("idUsuario", user.idUsuario);
    setValue("nivelUser", user.nivelUser);
    setValue("nome", user.nivelUser === "Clien" ? user.nomec : user.nomef);
    setValue("telefone", user.nivelUser === "Clien" ? user.telefonec : user.telefonef);
    setValue("email", user.nivelUser === "Clien" ? user.emailc : user.emailf);
  }

  // Exibe POPUP para EXCLUIR usuário
  const confirmAccountDeletePopup = (user) => {
    setShowConfirmAccountDelete(true);
    setSelectedUser(user);
    setValue("email", "");
    setValue("idUsuario", user.idUsuario);
    setValue("nivelUser", user.nivelUser);
    setEditUserId(user.nivelUser === "Clien" ? user.idCliente : user.idFuncionario)
  };

  // Exibe POPUP para REGISTRAR CLIENTE
  const showCadastroCliente = () => {
    setShowRegCliente(true);
  }

  // Exibe POPUP para REGISTRAR FUNCIONÁRIO
  const showCadastroFunc = () => {
    setShowRegFunc(true);
  }

  // Exibe POPUP de AÇÃO CONCLUIDA COM SUCESSO
  const handleAcaoConcluida = () => {
    handleClose();
    setShowConfirmCad(true);
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        {/* Barra de pesquisa */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Pesquisar"
            ref={inputRef}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
            onFocus={() => setIsFocused(true)}
          />

          <select className={styles.filterSelect}
            value={userLevelFilter}
            onChange={(e) => setUserLevelFilter(e.target.value)}
          >
            <option value="">Nível usuário</option>
            <option value="Clien">Cliente</option>
            <option value="Func">Funcionário</option>
          </select>
        </div>

        <div className={styles.regUser}>
          <button className={styles.action_btn} onClick={showCadastroCliente}>Registrar Cliente</button>
          <button className={`${styles.action_btn} ${styles.close}`} onClick={showCadastroFunc}>Registrar Funcionário</button>
        </div>

        {/* Tabela de usuários */}
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableRow}>
              <th className={`${styles.tableHead} ${styles.padding}`}>Usuário</th>
              <th className={styles.tableHead}>Nível usuário</th>
              <th className={styles.tableHead}>Email</th>
              <th className={styles.tableHead}>Informações</th>
              <th className={styles.tableHead}></th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredUsers.map((user) => (
              <tr key={user.idUsuario} className={styles.tableRow}>
                <td className={styles.user}>
                  <div className={styles.center_user}>
                    {
                      user.imagem != null ?
                        <div className={styles.profileImageWrapper}>
                          <img
                            src={`http://localhost:3001/img/${user.imagem}`}
                            alt="Imagem cadastrada"
                            className={`${styles.messageImage} ${styles.previewImage}`}
                          />
                        </div>
                        :
                        <div className={styles.profileImageWrapper}>
                          <FaRegCircleUser className={styles.icon} />
                        </div>
                    }
                    {user.nivelUser === "Clien" ? user.nomec : user.nomef}
                  </div>
                </td>
                <td className={styles.userLevel}>{user.nivelUser === "Clien" ? "Cliente" : "Funcionário"}</td>
                <td className={styles.email}>{user.nivelUser === "Clien" ? user.emailc : user.emailf}</td>
                <td className={styles.info_user}>
                  <div className={styles.center_info} onClick={() => { showInformations(user) }}>
                    <FaEye className={styles.icon} />
                    <span>Ver informações</span>
                  </div>
                </td>
                <td className={styles.actions}>
                  <div className={styles.center_actions}>
                    <FaPen className={styles.icon} onClick={() => { editInformations(user) }} />
                    <FaTrash className={`${styles.icon} ${styles.icon_trash}`} onClick={() => { confirmAccountDeletePopup(user) }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.overlay} style={{ display: showConfirmAccountDelete || showInformation || showEditInformation || showRegCliente || showRegFunc || showConfirmCad ? 'block' : 'none' }} />

      <div className={`${styles.popup_container} ${currentStep === 2 || showInformation || showRegFunc ? styles.popup_container_large : ""}`}
        style={{ display: showConfirmAccountDelete || showInformation || showEditInformation || showRegCliente || showRegFunc || showConfirmCad ? 'block' : 'none' }}>

        {/* Popup para VISUALIZAÇÃO de INFORMAÇÕES */}
        {showInformation && selectedUser && (
          <div className={styles.container_infoUser}>
            <FaXmark className={styles.close_icon} onClick={handleClose} />
            <div className={styles.title}>
              <div className={styles.title_text}>Informações</div>
            </div>

            <form className={styles.infoSection}>
              <div className={styles.column}>
                <label className={styles.label}>Nome</label>
                <input
                  type="text"
                  placeholder="Nome"
                  disabled={!isEditable}
                  {...register("nome")}
                  defaultValue={selectedUser.nomec || selectedUser.nomef}
                  className={`${styles.input_info} ${errors?.nome && styles.input_error}`}
                />

                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  disabled={!isEditable}
                  {...register("email")}
                  defaultValue={selectedUser.emailc || selectedUser.emailf}
                  className={`${styles.input_info} ${errors?.email && styles.input_error}`}
                />

                <label className={styles.label}>Telefone</label>
                <input
                  type="text"
                  placeholder="Telefone"
                  disabled={!isEditable}
                  {...register("telefone")}
                  defaultValue={selectedUser.telefone}
                  className={styles.input_info}
                />

                <label className={styles.label}>CPF</label>
                <input
                    type="text"
                    name="C.P.F"
                    {...register("cpf")}
                    disabled={!isEditable}
                    className={styles.input_info}
                  />
              </div>

              <div className={styles.column}>
                {selectedUser.nivelUser === "Clien" ? (
                  <>
                    <label className={styles.label}>Estado</label>
                    <input
                      type="text"
                      placeholder="Estado"
                      disabled={!isEditable}
                      {...register("estado")}
                      defaultValue={selectedUser.estado}
                      className={styles.input_info}
                    />

                    <label className={styles.label}>Cidade</label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      disabled={!isEditable}
                      {...register("cidade")}
                      defaultValue={selectedUser.cidade}
                      className={styles.input_info}
                    />

                    <label className={styles.label}>Rua</label>
                    <input
                      type="text"
                      placeholder="Rua"
                      disabled={!isEditable}
                      {...register("rua")}
                      defaultValue={selectedUser.rua}
                      className={styles.input_info}
                    />

                    <label className={styles.label}>Bairro</label>
                    <input
                      type="text"
                      placeholder="Bairro"
                      disabled={!isEditable}
                      {...register("bairro")}
                      defaultValue={selectedUser.bairro}
                      className={styles.input_info}
                    />

                    <label className={styles.label}>CEP</label>
                    <input
                      type="text"
                      placeholder="CEP"
                      disabled={!isEditable}
                      {...register("cep")}
                      defaultValue={selectedUser.cep}
                      className={styles.input_info}
                    />

                    <label className={styles.label}>Número</label>
                    <input
                      type="text"
                      placeholder="Número"
                      disabled={!isEditable}
                      {...register("numero")}
                      defaultValue={selectedUser.numero}
                      className={styles.input_info}
                    />
                  </>
                ) : (
                  <>
                    <label className={styles.label}>Descrição</label>
                    <textarea
                      placeholder="Descrição"
                      disabled={!isEditable}
                      {...register("descricao")}
                      defaultValue={selectedUser.descricao}
                      className={styles.input_info}
                    />
                  </>
                )}
              </div>
            </form>

            <div className={styles.center_btn}>
              <button
                className={`${styles.action_btn} ${styles.close} ${styles.espacamentoTop}`}
                onClick={handleClose}
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Popup para EDIÇÃO de INFORMAÇÕES */}
        {showEditInformation && selectedUser && (
          <div className={styles.container_editInfoUser}>
            <center><p className={styles.input_message}>{error}</p></center>
            <FaXmark className={styles.close_icon} onClick={handleClose} />
            <div className={styles.title}>
              <div className={styles.title_text}>Editar Informações</div>
            </div>

            <form className={styles.editSection}>
              <div className={styles.formContainer}>
                <div className={styles.column}>
                  <input type='hidden' {...register("idUsuario")} />
                  <input type='hidden' {...register("nivelUser")} />
                  <label className={styles.label}>Nome</label>
                  <input
                    type="text"
                    name="nome"
                    {...register("nome", {
                      required: true,
                      minLength: 3,
                      maxLength: 255,
                    })}
                    className={`${styles.input_info} ${errors?.nome && styles.input_error}`}
                  />
                  {errors?.nome?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                  {errors?.nome?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 3 caracteres</p>}
                  {errors?.nome?.type == 'maxLength' && <p className={styles.input_message}>Nome muito grande</p>}

                  <label className={styles.label}>Email</label>
                  <input type="text"
                    {...register("email", {
                      required: true,
                      maxLength: 50
                    })}
                    className={`${styles.input_info} ${styles.input_senha} ${errors?.senha && styles.input_error}`}
                  />
                  {errors?.email?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                  {errors?.email?.type == 'maxLength' && <p className={styles.input_message}>Senha muito grande</p>}

                  <label className={styles.label}>Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    {...register("telefone")}
                    className={styles.input_info}
                  />
                </div>
              </div>

              <button type="button" onClick={() => { handleSubmit(handleSave)() }} className={`${styles.action_btn} ${styles.register_btn}`}>Alterar</button>
            </form>

            <div className={styles.center_btn}>
              <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
            </div>
          </div>
        )}

        {/* Popup de EXCLUSÃO DE CONTA */}
        {showConfirmAccountDelete && selectedUser && (
          <div className={styles.container_accountDelete}>
            <FaXmark className={styles.close_icon} onClick={handleClose} />
            <div className={styles.title}>
              <div className={styles.title_text}>Excluir Conta</div>
              <center><p className={styles.input_message}>{error}</p></center>
            </div>
            <form>
              <p className={styles.info}>
                Digite o nome do usuário e o código de administrador para poder exclui-la.
              </p>
              <input type='hidden' {...register("idUsuario")} />
              <input type='hidden' {...register("nivelUser")} />

              <label className={`${styles.label} ${styles.label_popup}`}>Digite o email do usuário</label>
              <input
                type="email"
                placeholder='Email'
                {...register('email', {
                  required: true,
                  maxLength: 255
                })}
                className={`${styles.input_info} ${errors?.email && styles.input_error}`}
              />
              {errors?.email?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
              {errors?.email?.type == 'maxLength' && <p className={styles.input_message}>Email muito grande</p>}


              <label className={`${styles.label} ${styles.label_popup}`}>Digite o código de adm</label>
              <input
                type="password"
                {...register("senha", { required: true, minLength: 8, maxLength: 50 })}
                placeholder="Senha"
                className={`${styles.input_info} ${errors?.senha && styles.input_error}`}
              />
              {errors?.senha?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
              {errors?.senha?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 8 caracteres</p>}
              {errors?.senha?.type == 'maxLength' && <p className={styles.input_message}>Senha muito grande</p>}

              <div className={styles.checkbox_confirmDelete}>
                <input
                  type="checkbox"
                  className={styles.checkbox_accountDelete}
                  {...register("checkbox", {
                    required: true
                  })}
                />
                <p className={styles.info}>Estou ciente que ao deletar a conta, todas as informações serão perdidas permanentemente.</p>
                {errors?.checkbox?.type == 'required' && <p className={styles.input_message}>Tem que confirma para proceguir</p>}
              </div>

              <button type="button" onClick={() => { handleSubmit(handleDelete)() }} className={styles.action_btn}>Excluir</button>
            </form>

            <div className={styles.center_btn}>
              <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Popup para CADASTRO de Cliente */}
        {showRegCliente && (
          <div className={styles.container_regCliente}>
            {currentStep === 1 && (
              <>
                <FaXmark className={styles.close_icon} onClick={handleClose} />
                <div className={styles.title}>
                  <h2 className={styles.title_text}>Cadastro Cliente</h2>
                </div>
                <center><p className={styles.input_message}>{error}</p></center>
                <div className={`${styles.content} ${currentStep === 1 ? styles.content_normal : ""}`}>
                  <input
                    type='text'
                    placeholder='Nome'
                    {...register('nome', {
                      required: true,
                      minLength: 3,
                      maxLength: 255,
                    })}
                    className={`${styles.input_info} ${errors.nome && styles.input_error}`}
                  />
                  {errors?.nome?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                  {errors?.nome?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 3 caracteres</p>}
                  {errors?.nome?.type == 'maxLength' && <p className={styles.input_message}>Nome muito grande</p>}

                  <input
                    type='text'
                    placeholder='Email'
                    {...register('email', {
                      required: true,
                      minLength: 3,
                      maxLength: 50,
                      validate: (value) => validator.isEmail(value) || "Email inválido"
                    })}
                    className={`${styles.input_info} ${errors.email && styles.input_error}`}
                  />
                  {errors?.email?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                  {errors?.email?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 3 caracteres</p>}
                  {errors?.email?.type == 'maxLength' && <p className={styles.input_message}>Email muito grande</p>}
                  {errors?.email?.type == 'validate' && <p className={styles.input_message}>Email inválido</p>}

                  <input
                    type="password"
                    placeholder="Senha"
                    {...register('senha', {
                      required: true,
                      minLength: 8,
                      maxLength: 50,
                    })}
                    className={`${styles.input_info} ${errors.senha && styles.input_error}`}
                  />
                  {errors?.senha?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                  {errors?.senha?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 8 caracteres</p>}
                  {errors?.senha?.type == 'maxLength' && <p className={styles.input_message}>Senha muito grande</p>}

                  <input
                    type="password"
                    placeholder="Confirmar senha"
                    {...register('confirmarSenha', {
                      validate: (value) => value === senha || "As senhas não correspondem"
                    })}
                    className={`${styles.input_info} ${errors.confirmarSenha && styles.input_error}`}
                  />
                  {errors.confirmarSenha && <p className={styles.input_message}>{errors.confirmarSenha.message}</p>}

                  <button className={styles.action_btn} type="button" onClick={() => handleSubmit(handleNext)()}>Próximo</button>

                  <button onClick={handleClose} className={`${styles.action_btn} ${styles.close}`}>Cancelar</button>
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <FaXmark className={styles.close_icon} onClick={handleClose} />
                <div className={styles.title}>
                  <h2 className={styles.title_text}>Cadastro Extra</h2>
                  <center><p className={styles.input_message}>{error}</p></center>
                </div>
                <div className={styles.content}>
                  <div className={styles.columns_container}>
                    <div className={styles.column}>

                      <input
                        type="text"
                        placeholder="Telefone"
                        {...register("telefone", {
                          required: "Telefone é obrigatório",
                          pattern: {
                            value: /^[0-9]{10,11}$/,
                            message: "Telefone deve conter 10 ou 11 números",
                          },
                        })}
                        className={`${styles.input_info} ${errors.telefone && styles.input_error}`}
                      />
                      {errors.telefone && <p className={styles.input_message}>{errors.telefone.message}</p>}

                      <input
                        type="text"
                        name="C.P.F"
                        {...register("cpf", {
                          validate: value => {
                            if (!value) return "CPF é obrigatório";
                            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                            return cpfRegex.test(value) || "Formatação inválida para CPF";
                          },
                        })}
                        placeholder='CPF'
                        className={styles.input_info}
                      />
                      {errors.cpf && <p className={styles.error_message}>{errors.cpf.message}</p>}

                      <input
                        type="text"
                        placeholder="Estado"
                        {...register("estado", {
                          required: "Estado é obrigatório",
                        })}
                        className={`${styles.input_info} ${errors.estado && styles.input_error}`}
                      />
                      {errors.estado && <p className={styles.input_message}>{errors.estado.message}</p>}

                      <input
                        type="text"
                        placeholder="Cidade"
                        {...register("cidade", {
                          required: "Cidade é obrigatória",
                        })}
                        className={`${styles.input_info} ${errors.cidade && styles.input_error}`}
                      />
                      {errors.cidade && <p className={styles.input_message}>{errors.cidade.message}</p>}
                    </div>
                    <div className={styles.column}>
                      <input
                        type="text"
                        placeholder="Rua"
                        {...register("rua", {
                          required: "Rua é obrigatória",
                        })}
                        className={`${styles.input_info} ${errors.rua && styles.input_error}`}
                      />
                      {errors.rua && <p className={styles.input_message}>{errors.rua.message}</p>}

                      <input
                        type="text"
                        placeholder="Bairro"
                        {...register("bairro", {
                          required: "Bairro é obrigatório",
                        })}
                        className={`${styles.input_info} ${errors.bairro && styles.input_error}`}
                      />
                      {errors.bairro && <p className={styles.input_message}>{errors.bairro.message}</p>}

                      <input
                        type="text"
                        placeholder="CEP"
                        {...register("cep", {
                          required: "CEP é obrigatório",
                          pattern: {
                            value: /^[0-9]{8}$/,
                            message: "CEP deve conter 8 números",
                          },
                        })}
                        className={`${styles.input_info} ${errors.cep && styles.input_error}`}
                      />
                      {errors.cep && <p className={styles.input_message}>{errors.cep.message}</p>}

                      <input
                        type="text"
                        placeholder="Número"
                        {...register("numero", {
                          required: "Número é obrigatório",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Número deve ser numérico",
                          },
                        })}
                        className={`${styles.input_info} ${errors.numero && styles.input_error}`}
                      />
                      {errors.numero && <p className={styles.input_message}>{errors.numero.message}</p>}
                    </div>
                  </div>

                  <div className={styles.center_btn}>
                    <button className={`${styles.action_btn} ${styles.register_btn}`} onClick={() => handleSubmit(handleFinalSubmit)()}>Cadastrar</button>
                    <button className={`${styles.action_btn} ${styles.close}`} onClick={() => setCurrentStep(1)}>Voltar</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Popup para CADASTRO de Funcionário */}
        {showRegFunc && (
          <div className={styles.container_regFunc}>
            <FaXmark className={styles.close_icon} onClick={handleClose} />
            <div className={styles.title}>
              <h2 className={styles.title_text}>Cadastro Funcionário</h2>
            </div>
            <center><p className={styles.input_message}>{error}</p></center>

            <div className={styles.content}>
              <div className={styles.columns_container}>
                <div className={styles.column}>
                  <input
                    type='text'
                    placeholder='Nome'
                    {...register('nome', {
                      required: true,
                      minLength: 3,
                      maxLength: 255,
                    })}
                    className={`${styles.input_info} ${errors.nome && styles.input_error}`}
                  />
                  {errors?.nome?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                  {errors?.nome?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 3 caracteres</p>}
                  {errors?.nome?.type == 'maxLength' && <p className={styles.input_message}>Nome muito grande</p>}

                  <input
                    type='text'
                    placeholder='Email'
                    {...register('email', {
                      required: true,
                      minLength: 3,
                      maxLength: 50,
                      validate: (value) => validator.isEmail(value) || "Email inválido"
                    })}
                    className={`${styles.input_info} ${errors.email && styles.input_error}`}
                  />
                  {errors?.email?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                  {errors?.email?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 3 caracteres</p>}
                  {errors?.email?.type == 'maxLength' && <p className={styles.input_message}>Email muito grande</p>}
                  {errors?.email?.type == 'validate' && <p className={styles.input_message}>Email inválido</p>}

                  <input
                    type="password"
                    placeholder="Senha"
                    {...register('senha', {
                      required: true,
                      minLength: 8,
                      maxLength: 50,
                    })}
                    className={`${styles.input_info} ${errors.senha && styles.input_error}`}
                  />
                  {errors?.senha?.type == 'required' && <p className={styles.input_message}>Esse campo é obrigatório</p>}
                  {errors?.senha?.type == 'minLength' && <p className={styles.input_message}>Deve conter no mínimo 8 caracteres</p>}
                  {errors?.senha?.type == 'maxLength' && <p className={styles.input_message}>Senha muito grande</p>}

                  <input
                    type="password"
                    placeholder="Confirmar senha"
                    {...register('confirmarSenha', {
                      validate: (value) => value === senha || "As senhas não correspondem"
                    })}
                    className={`${styles.input_info} ${errors.confirmarSenha && styles.input_error}`}
                  />
                  {errors.confirmarSenha && <p className={styles.input_message}>{errors.confirmarSenha.message}</p>}

                </div>
                <div className={styles.column}>
                  <input
                    type="text"
                    placeholder="Telefone"
                    {...register("telefone", {
                      required: "Telefone é obrigatório",
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: "Telefone deve conter 10 ou 11 números",
                      },
                    })}
                    className={`${styles.input_info} ${errors.telefone && styles.input_error}`}
                  />
                  {errors.telefone && <p className={styles.input_message}>{errors.telefone.message}</p>}

                  <input
                    type="text"
                    name="C.P.F"
                    placeholder='CPF'
                    {...register("cpf", {
                      validate: value => {
                        if (!value) return "CPF é obrigatório";
                        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                        return cpfRegex.test(value) || "Formatação inválida para CPF";
                      },
                    })}
                    className={styles.input_info}
                  />
                  {errors.cpf && <p className={styles.error_message}>{errors.cpf.message}</p>}

                  <textarea
                    type="text"
                    name="descricao"
                    {...register("descricao")}
                    placeholder='Descrição'
                    className={styles.input_info}
                  />

                  {error && <p className={styles.error}>{error}</p>}
                </div>
              </div>
              <div className={styles.center_btn}>
                <button className={`${styles.action_btn} ${styles.register_btn}`} onClick={() => { handleSubmit(dadosFunc)() }}>Cadastrar</button>
                <button onClick={handleClose} className={`${styles.action_btn} ${styles.close}`}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Popup de confirmação de cadastro de Usuário */}
        {showConfirmCad && (
          <div className={styles.container_infoSaved}>
            <FaXmark className={styles.close_icon} onClick={handleClose} />
            <FaCheck className={styles.icon_infoSaved} />
            <p className={styles.info}>
              Ação realizada com sucesso!
            </p>

            <button className={`${styles.action_btn} ${styles.close}`} onClick={handleClose}>Fechar</button>
          </div>
        )}
      </div >

      <Footer />
    </>
  );
}
