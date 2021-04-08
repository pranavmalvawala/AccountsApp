import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { PersonInterface, PersonHelper, ApiHelper } from '.';

interface Props {
    person: PersonInterface,
    email: string,
    handleAssociatePerson: (person: PersonInterface) => void,
    callNow: Date,
}

export const SuggestPerson: React.FC<Props> = ({ person, email, handleAssociatePerson, callNow }) => {
    const [suggestedPerson, setSuggestedPerson] = useState<PersonInterface>(null);

    useEffect(() => {
        if (!person) {
            setSuggestedPerson(null)
            ApiHelper.get(`/people/search?email=${email}`, "MembershipApi").then(foundPerson => {
                setSuggestedPerson(foundPerson[0]);
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callNow])

    if (person || !suggestedPerson || !email) return null;
    return (
        <>
            <p><small><em>suggestion</em></small></p>
            <Table size="sm">
                <tbody>
                    <tr>
                        <td><img src={PersonHelper.getPhotoUrl(suggestedPerson)} width="60px" height="45px" style={{borderRadius: "5px"}} alt="avatar" /></td>
                        <td>{suggestedPerson?.name.display}</td>
                        <td><a className="text-success" data-cy="change-person" href="about:blank" onClick={(e) => { e.preventDefault(); handleAssociatePerson(suggestedPerson)}}><i className="fas fa-user"></i> Add</a></td>
                    </tr>    
                </tbody>    
            </Table>
        </>
    )
}