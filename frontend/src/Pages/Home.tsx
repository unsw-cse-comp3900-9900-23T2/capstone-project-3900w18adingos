import { Link } from 'react-router-dom';
import '../styles/Introduction.css';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className="home">

        <Header>
        <h1>Welcome to EMS - Your Eatery Management System</h1>
        <p>Enhancing dining experiences through digital innovation.</p>
        </Header>

      <main>
        <section className="home-section">
          <h2>Background</h2>
          <p>
            As the world shifts more towards digitalisation, the restaurant sector is adapting to maintain a strong digital presence. 
            To help them with this task, we developed EMS, an all-in-one solution that allows eateries to manage their profiles, menus, and offer personalised deals.
          </p>
        </section>

        <section className="home-section">
          <h2>Our Solution</h2>
          <p>
            We've designed unique features that provide a more convenient and comprehensive user experience. The most notable among them are our Universal loyalty system and Advanced Map Integration. These enhancements contribute to a more seamless and satisfying dining experience.
          </p>
        </section>

        <section className="home-section">
          <h2>Unique Features</h2>
          <ul>
            <li><b>Universal Loyalty System:</b> Simplify your rewards experience with a universal loyalty system, allowing for a virtual wallet to join and use multiple loyalty programs in one place.</li>
            <li><b>Advanced Map Integration:</b> Find the perfect restaurant with real-time availability visualisation and advanced filtering options. Users can refine their search based on location, cuisine, and other filters.</li>
          </ul>
        </section>

        <section className="home-section">
          <h2>Get Started</h2>
          <p>
            Ready to experience the future of dining? Get started by signing up or logging in to your account.
          </p>
          <div className="home-buttons">
            <Link to="/auth/register" className="btn">Register</Link>
            <Link to="/auth/login" className="btn">Login</Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; EMS {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;
