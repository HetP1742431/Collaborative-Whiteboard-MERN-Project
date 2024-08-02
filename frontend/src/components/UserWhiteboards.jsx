import { useNavigate } from "react-router-dom";

const UserWhiteboards = (e) => {
  const navigate = useNavigate();

  const handleClickCreate = async () => {
    try {
      navigate("/whiteboards/create");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickJoin = async () => {
    try {
      navigate("/whiteboards/join");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1> Hello from UserWhiteboards</h1>
      <button onClick={handleClickCreate}> Create Whiteboard</button>
      <button onClick={handleClickJoin}> Join existing whiteboard</button>
    </>
  );
};

export default UserWhiteboards;
