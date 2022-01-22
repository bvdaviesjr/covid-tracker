import { Card, CardContent, Typography} from '@mui/material'
import React from 'react'

export default function CovidInfo({headText, cases, total}) {
    return (
        <Card className='infoBox'>
            <CardContent>
                <Typography color='textSecondary'>{headText}</Typography>
                <h2>{cases}</h2>
                <Typography color='textSecondary'>
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}
