import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div>
            <h2>Welcome to Agile Track System</h2>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/signup"><button>Sign Up</button></Link>
        </div>
    );
}
export default Dashboard;
