import "../assets/Profile.css"

export default function GroupPopup({groupID, groupName, type, users, closePopup}: {groupID:string, groupName:string, type:string, users:string[], closePopup: Function}) {
    return (
        <div className='popup'>
            <div className='popup_inner'>
                <table className="group-info-table">
                    <thead><tr><td colSpan={2}><h3>Group Information</h3></td></tr></thead>
                    <tbody>
                        <tr><td><strong>Group ID</strong></td><td>{groupID}</td></tr>
                        <tr><td><strong>Group Name</strong></td><td>{groupName}</td></tr>
                        <tr><td><strong>Type</strong></td><td>{type}</td></tr>
                        <tr><td><strong>Group Members</strong></td><td><ul>{users.map((user, index) => {
                            return (
                                <li key={index}>{user}</li>
                            )
                        })}</ul></td></tr>
                    </tbody>
                </table>
                <button className="popup-button" onClick={() => closePopup()}>Close</button>
            </div>
            
        </div>
    )
}