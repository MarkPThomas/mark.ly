import * as React from 'react';

interface NoMemberProps {
  baseUrl: string;
}

export const NoMember: React.FC<NoMemberProps> = (props) => {
  const container = {
    position: 'relative' as const,
    zIndex: 100,
    paddingTop: '100px',
    paddingLeft: '100px',
    paddingRight: '40px'
  };

  const section = {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    marginBottom: '8px',
    width: '100%',
    background: '#fff',
    border: `1px solid`,
    padding: '36px 40px 36px 32px'
  };

  const button = {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#fff',
    textDecoration: 'none',
    padding: '4px 16px',
    borderRadius: '2px',
    fontWeight: 500,
    height: '40px',
    marginTop: '10px',
    marginBottom: '40px',
    transition: 'background-color .3s ease'
  };

  const title = {
    fontSize: '18px',
    fontWeight: 400,
    marginTop: '40px'
  };

  const subtitle = {
    width: '100%',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: 400,
    color: '#555',
    margin: '15px 0'
  };

  return (
    <html lang="en">
      <head>
        <title>Home</title>
        <base href={props.baseUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>

      <body>
        <div id="container">
          <div id="chrome" />
          <main id="main" tabIndex={-1}>
            <div className="container-fluid p-0">
              <div className="container-fluid p-0">
                <div id="no-member-root">
                  <div id="app-container">
                    <div style={container}>
                      <div style={section}>
                        <div style={title}>Title</div>
                        <div style={subtitle}>
                          Subtitle
                        </div>
                        <div>
                          <a className={'no-member-button'} style={button} href="">
                            Sign up to become a member!
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
};

export default NoMember;