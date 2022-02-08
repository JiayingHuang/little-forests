import { Button } from "@material-ui/core";
import { Container } from "@material-ui/core";
import '@fontsource/roboto'

type Props = {
    paraText: string;
    buttonText: string;
}

const SecondaryItem = ( { buttonText, paraText }: Props) => {
    return (
        <Container>
            
            <Button
              variant="contained" 
              color="primary"  
              style = {{ color: "white" }}
            >{ buttonText } </Button>
            <p>{paraText}</p>
        </Container>
    )
}

export { SecondaryItem as default }