import React, {useContext, useEffect, useState} from "react"
import {Icon, ProgressBar, Table, Container} from "react-materialize"
import {useRouteMatch, Link} from "react-router-dom"
import {DeviceContext} from "../DeviceProvider"

const FileManager = () => {
  const { dir: getDir } = useContext(DeviceContext);
  const { params } = useRouteMatch()
  const { path: pwd = "/" } = params
  const pwdArr = pwd.split('/').filter(Boolean)

  const [dir, setDir] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getDir && getDir(pwd, (files) => {
      setLoading(false)
      setDir(files)
      console.log({files});
    });
  }, [getDir, pwd])


  return (
    <Container style={{marginTop: '3rem', marginBottom: '3rem'}}>
      <h1 style={{ fontSize: '1.2rem', marginTop: 0}} className={'dir-listing'}>
        <Link to={'/files/'}><Icon className={'left'}>folder</Icon></Link>
        { pwdArr.map((dir, i) =>
          <React.Fragment>
            <span>/</span>
            <Link to={'/files/' + pwdArr.slice(0, i).join('/')}>{ dir }</Link>
          </React.Fragment>) }
      </h1>
      { !loading && <Table>
        { dir.map(entry => (
          <tr key={entry.name}>
            <td>{entry.dir ? <Icon className={'left'}>folder</Icon> : null}</td>
            <td><Link to={'/files' + entry.name}>{entry.name}</Link></td>
            <td>{entry.size}</td>
          </tr>
        ))}
      </Table> }
      { loading && <ProgressBar /> }
    </Container>
  )
}

export default FileManager
