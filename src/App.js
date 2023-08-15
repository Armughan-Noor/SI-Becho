import './App.css';
import { Container, Row, Col  } from 'react-bootstrap';
import {Route, Routes} from 'react-router-dom'
import LoginForm from './components/SignIn';
import SignUpForm from './components/SignUp';
import {UserAuthContextProvider} from '../src/context/UserAuthContext';
import Home from './Home';
import ProtectedRoute from './components/ProtectedRoute';
import AdForm from './components/AdForm';

function App() {
  return (
    <Container>
      <Row>
        <Col>
        <UserAuthContextProvider>
          <Routes>
          <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>} />
            <Route path='/' element={<LoginForm/>} />
            <Route path='/signup' element={<SignUpForm/>} />
            <Route path='/adform' element={<AdForm/>} />
          </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
