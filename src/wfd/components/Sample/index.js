import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import workflowAPI from '../../../api';
import Designer from '../../index';
import { rawToData } from '../../../util/protocolUtil';

export default function Sample({ match }) {
  const designerRef = useRef(null);
  const [workflowData, setWorkflowData] = useState(null);

  useEffect(() => {
    axios.get(
        `${workflowAPI.getWorkflow}/${match.params.name}`,
    ).then(res => {
      setWorkflowData(rawToData(res.data));
    }).catch(e => {
      console.info(e);
    })
  }, [match]);

  return <Designer
        isView
        ref={ designerRef }
        data={ workflowData }
        height={ 800 }
    />;
}
