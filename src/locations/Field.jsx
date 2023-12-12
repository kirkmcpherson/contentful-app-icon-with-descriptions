import React, {useState, useEffect } from 'react';
import { Note, Button, Table, TableBody, TableRow, TableCell, TextInput, Asset } from '@contentful/f36-components';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK();

  const fieldValue = sdk.field.getValue();
  const [rows, setRows] = useState(fieldValue ? fieldValue : []);

  const handleImageUpload = async (index, c, key) => {
    sdk.dialogs.selectSingleAsset({}).then((asset) => {

      sdk.space.getAsset(asset.sys.id).then((assetObj) => {
        const rowIndex = index;
        const colIndex = c;
        const updatedRows = [...rows];
        const fileName = assetObj.fields.file['en-US'].url;
        updatedRows[rowIndex][colIndex][key] = fileName;
        setRows(updatedRows);
      })
    });
  }

  useEffect(() => {
    sdk.window.startAutoResizer();
  })

  useEffect(() => {
    const submitRows = [...rows];
    submitRows.forEach((r, c) => {
      submitRows[c] = r.filter(i => !!i.Icon || !!i.Heading || !!i.Text);
    });
    sdk.field.setValue(submitRows.filter(r => r.length));
  }, [rows, sdk.field]);

  // add row
  const onAddRowButtonClicked = () => {
    const updatedRows = [...rows];
    updatedRows.push([{ Icon: '', Heading: '', Description: '' }]);
    setRows(updatedRows);
  };

  // update rows with new Key
  const onChanged = (e, key) => {
    const rowsIndex = e.target.dataset.index;
    const [rowIndex, colIndex] = rowsIndex.split(',');
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex][key] = e.target.value;
    setRows(updatedRows);
  }

  // remove row
  const onDeleteButtonClicked = (rowIndex, colIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].splice(colIndex, 1);
    setRows(updatedRows);
  }

  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return (
    <>
      <Note style={{"marginBottom" : "5px"}}>Please enter icons, headings and descriptions...</Note>
      <Table>
          <TableBody>
          {rows.map((term, index) => {
                return <TableRow key={`term${index}`}>
                  {
                    term.map((item, c) => (
                      <TableCell key={`col${index}${c}`}>
                        <div>
                          <Asset style={{"width": "90px", "height": "90px"}}  src={item.Icon}></Asset>
                          <Button 
                            variant="positive"
                            style={{"marginBottom" : "5px"}}
                            icon="Plus"
                            buttonType="naked"
                            onClick={(e) => handleImageUpload(index, c, 'Icon')}>
                              Select Icon
                          </Button>
                        </div>
                        <div>
                          <TextInput 
                            style={{"marginBottom" : "5px"}}
                            value={item.Heading}
                            placeholder="Heading"
                            data-index={`${index},${c}`}
                            onChange={(e) => onChanged(e, 'Heading')}>
                          </TextInput>
                        </div>
                        <div>
                          <TextInput 
                            style={{"marginBottom" : "5px"}}
                            value={item.Description}
                            placeholder="Enter description"
                            data-index={`${index},${c}`}
                            onChange={(e) => onChanged(e, 'Description')}>
                          </TextInput>
                        </div>
                        <div>
                        <Button 
                        variant="negative"
                        style={{"marginBottom" : "5px"}}
                        icon="Delete"
                        buttonType="naked"
                        data-index={`${index},${c}`}
                        onClick={() => onDeleteButtonClicked(index, c)}>
                          Delete Row
                      </Button>
                        </div>
                      </TableCell>
                    ))
                  }
                </TableRow>
              })}
          </TableBody>
      </Table>
      <div style={{marginTop: '10px', marginBottom: '10px'}}>
        <Button 
          variant='primary'
          icon="Plus"
          buttonType="naked"
          onClick={onAddRowButtonClicked}>
            Add Row
        </Button>
      </div>
    </>
  )
  
};

export default Field;
