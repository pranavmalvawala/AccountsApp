import React, { useState, useEffect } from "react"
import { Table } from "react-bootstrap"
import { PersonAdd, PersonInterface, PersonHelper } from "."

interface Props {
    person: PersonInterface,
    handleAssociatePerson: (person: PersonInterface) => void,
    searchStatus: (value: boolean) => void,
}

export const AssociatePerson: React.FC<Props> = ({ person, handleAssociatePerson, searchStatus }) => {
  const [showSearchPerson, setShowSearchPerson] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    setShowSearchPerson(false);
    setHasSearched(false);
  }, [person])

  const searchClicked = () => {
    setHasSearched(true);
  }

  useEffect(() => {
    searchStatus(hasSearched);
  }, [hasSearched, searchStatus])

  if (!person || showSearchPerson) return <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handleAssociatePerson} searchClicked={searchClicked} />;
  return (
    <Table size="sm">
      <tbody>
        <tr>
          <td className="border-0"><img src={PersonHelper.getPhotoUrl(person)} width="60px" height="45px" style={{ borderRadius: "5px" }} alt="avatar" /></td>
          <td className="border-0">{person?.name?.display}</td>
          <td className="border-0"><a className="text-success" data-cy="change-person" href="about:blank" onClick={(e) => { e.preventDefault(); setShowSearchPerson(true) }}><i className="fas fa-user"></i> Change</a></td>
        </tr>
      </tbody>
    </Table>
  )
}
