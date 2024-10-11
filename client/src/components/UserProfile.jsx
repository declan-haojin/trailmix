function UserProfile({profile}) {
    return (
        <div className="user-profile">
            <img src={profile.profilePic} alt={`${profile.name}'s profile`}/>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
        </div>
    );
}

export default UserProfile;