import React from 'react'
import { Dropdown, Grid, Header, Image, Modal  } from 'semantic-ui-react'

const DropDown = ({ logout, profile, status, onChange, open }) => {

  let options = [
    { key: 'user', text: 'Account', icon: 'user', onClick: onChange  },
    { key: 'sign-out', text: 'Sign Out', icon: 'sign out', onClick: logout },
  ]

  return (
    <div>
      <Dropdown
        trigger={
          <span>
            <Image avatar src={profile.avatar_image} /> {profile.full_name}
          </span>
        }
        options={options}
        pointing='top'
        icon={null}/>

        <Modal open={open} className='modal container' closeIcon onClose={onChange}>
          <Modal.Content image>
            <Grid container stackable verticalAlign='middle'>
              <Grid.Row>
                <Grid.Column floated='right' width={7}>
                  <Image
                    circular
                    rounded
                    size='medium'
                    src={profile.avatar_image}
                  />
                </Grid.Column>
                <Grid.Column width={8}>
                  <Header as='h3' style={{ fontSize: '2em' }}>{profile.full_name}</Header>
                  <div className="meta" >{profile.user_name}</div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
    </div>
  )
}

export default DropDown
