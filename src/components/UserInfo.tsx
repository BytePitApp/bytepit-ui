import { Avatar } from "primereact/avatar";

interface Auth {
    image?: string;
    username?: string;
}

const UserInfo = ({ auth }: {auth: Auth | null}) => {
    return (
        <div className="flex justify-center items-center">
            <div style={{ borderRadius: '20px', width: '200px', height: '200px'}} className="inline-flex justify-center items-center flex-col flex-wrap pt-[5px] bg-white m-[10px]">
                <div className="flex justify-center items-center pb-[4px] w-32 h-32">
                    {auth?.image ? (
                        <Avatar
                            className="w-[90px] h-[90px] rounded-full transition-color ease-in-out duration-300 cursor-pointer hover:scale-105"
                            image={`data:image/jpeg;base64,${auth?.image}`}
                            size="large"
                            pt={{ image: { className: "rounded-lg object-cover" } }}
                        />
                    ) : (
                        <Avatar
                            className="w-[90px] h-[90px] rounded-full bg-secondary text-white hover:scale-105 transition-color ease-in-out duration-300 cursor-pointer"
                            template={<i className="pi pi-user text-4xl"></i>}
                            size="large"
                        />
                    )}      
                </div>
                <div className="text-[20px] font-bold mb-[10px]">
                    <p>{auth?.username}</p>
                </div>
            </div>
        </div>
    )
}

export default UserInfo;
