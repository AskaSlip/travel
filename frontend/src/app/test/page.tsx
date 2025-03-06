import React from 'react';
import UsersComponent from '@/components/Users/UsersComponent';
import RefreshComponent from '@/components/Refresh/RefreshComponent';

const TestPage = () => {

    return (
        <div>
            <h1>Test Page</h1>
          <RefreshComponent />
          <UsersComponent/>
        </div>
    );
};

export default TestPage;