import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/public')({
  component: Public,
})

function Public(){

    const navigate = useNavigate();

    useEffect(() => {
        navigate({to: '/'});
    }, [navigate]);

}
