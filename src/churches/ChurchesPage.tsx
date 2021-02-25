import React from 'react';
import { Row, Col } from 'react-bootstrap'
import { DisplayBox, ChurchInterface, ApiHelper } from './components'
import { Link } from "react-router-dom";

export const ChurchesPage = () => {
    const [churches, setChurches] = React.useState<ChurchInterface[]>(null);

    const loadData = () => {
        ApiHelper.get('/churches/', "AccessApi").then(data => setChurches(data));
    }

    const getChurchRows = () => {
        if (churches === null) return;
        const result: JSX.Element[] = [];
        churches.forEach((c, index) => {
            result.push(<tr className="group" key={index}>
                <td colSpan={2}>
                    <Link to={"/churches/" + c.id.toString()}>{c.name}</Link>
                </td>
            </tr>);
        });
        return result;
    }


    React.useEffect(() => { loadData(); }, []);

    return (
        <>
            <Row style={{ marginBottom: 25 }}>
                <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-church"></i> Your Churches</h1></div>
            </Row>
            <Row>
                <Col md={8}>
                    <DisplayBox headerIcon="fas fa-church" headerText="Select your church">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Church</th>
                                </tr>
                                {getChurchRows()}
                            </thead>
                        </table>
                    </DisplayBox>
                </Col>
                <Col md={4}>

                </Col>
            </Row>
        </>
    );
}
