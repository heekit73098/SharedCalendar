import NavBar from "./NavBar";
import "../assets/Features.css"

export default function Features() {
    return (
        <div>
            <NavBar />
            <div className="features-body">
                <h1>Features</h1>
                <ol>
                    <li className="features-list">
                        <span>Groups</span>
                        <ul>
                            <li>3 Types of Groups (Personal, Anonymous, Shared)</li>
                            <li>Personal Group is only shared to you, and cannot be shared with anyone.</li>
                            <li>Events shared with Anonymous Groups will appear as "Busy" to others.</li>
                            <li>Events shared with Shared Groups will appear as it is to others.</li>
                        </ul>
                    </li>
                    <li className="features-list">
                        <span>Calendar</span>
                        <ul>
                            <li>3 Types of Views (Monthly, Weekly, Daily)</li>
                            <li>Add, edit, delete any non-private Events</li>
                            <li>Any Event you add to a Group will be added to all of your other Groups as well.</li>
                            <li>Filter by Groups to view each Group individually.</li>
                        </ul>
                    </li>
                    <li className="features-list">
                        <span>Journal</span>
                        <ul>
                            <li>Add, delete Journals which are attached to Groups</li>
                            <li>Add, delete Entries in a Journal</li>
                            <li>Any Entry added to a Journal will appear in the Journal for everyone in the group.</li>
                        </ul>
                    </li>
                </ol>
            </div>
        </div>
    )
}