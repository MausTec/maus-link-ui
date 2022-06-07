import React, {useContext, useEffect, useState} from "react"
import {Button, Icon, ProgressBar, Table, Container} from "react-materialize"
import {useRouteMatch, Link} from "react-router-dom"
import {DeviceContext} from "../DeviceProvider"
import byteSize from 'byte-size'

const FileManager = () => {
  const { dir: getDir, send } = useContext(DeviceContext);
  const { params } = useRouteMatch()
  const pwd = params[0] || "/"
  const pwdArr = pwd.split('/').filter(Boolean)

  const [dir, setDir] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = () => {
    setLoading(true)
    getDir && getDir(pwd, ({files}) => {
      setLoading(false)
      setDir(files)
      console.log({files, pwd});
    });
  }

  const mkdir = (filename) => {
    send({
      mkdir: {
        path: [...pwdArr, filename].join('/'),
        nonce: (data) => {
          reload();
        }
      }
    })
  }

  const handleMkdir = (e) => {
    e.preventDefault();
    const filename = prompt("New Directory Name");
    filename && mkdir(filename);
  }

  useEffect(reload, [getDir, pwd]);

  const sorted = [...dir].sort((a, b) => {
    const dircmp = (a.dir ? 0 : 1) - (b.dir ? 0 : 1)
    if (dircmp !== 0) {
      return dircmp;
    }
    else if (a.name > b.name) {
      return 1;
    }
    else if (a.name < b.name) {
      return -1;
    }
    else {
      return 0;
    }
  })

  return (
    <Container style={{marginTop: '3rem', marginBottom: '3rem'}}>
      <div className={'header'} style={{ marginBottom: '3rem'}}>
        <div className={'right'}>
          <Button onClick={handleMkdir}>Mkdir</Button>
        </div>
        <h1 style={{ fontSize: '1.2rem', marginTop: 0, lineHeight: '2rem', verticalAlign: 'middle'}} className={'dir-listing'}>
          <Link to={'/files/'}><i className={'material-icons'} style={{ lineHeight: '2rem', verticalAlign: 'middle', float: 'left', height: '2rem'}}>home</i></Link>
          &nbsp;
          { pwdArr.map((dir, i) =>
            <React.Fragment>
              <span className={'dir-path-sep grey-text'} style={{ margin: '0 1rem' }}>/</span>
              <Link to={'/files/' + pwdArr.slice(0, i + 1).join('/')}>{ dir }</Link>
            </React.Fragment>) }
        </h1>
      </div>

      <div className={'card'}>
        { !loading && <Table>
          <tbody>
          { dir.length <= 0 && <tr>
            <td colSpan={2}>
              <div className={'center grey-text'}>No files here.</div>
            </td>
          </tr>}
            { sorted.map(entry => (
              <tr key={entry.name} className={entry.dir ? 'dir compact' : 'file'}>
                <td>
                  <Icon className={'left grey-text ' + (entry.dir ? 'primary-text' : '')}>{ entry.dir ? "folder" : "insert_drive_file" }</Icon>
                  <Link to={(entry.dir ? '/files' : '/file') + entry.name}>
                    {entry.name.replace(/^.*\//g, '')}
                  </Link>
                </td>
                <td align={"right"} className={'right-align grey-text text-darken-1'}>
                  { entry.size ? byteSize(entry.size).toString() : null }
                </td>
                <td align={"right"} className={'right-align hide-unless-hover'}>
                  <a href={'#'}><Icon>delete</Icon></a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table> }
        { loading && <ProgressBar /> }
      </div>
    </Container>
  )
}

export default FileManager
