export function constructMessageForFacilityAssignment(
  assignmentDetails: any,
  keywordsKeys: any
) {
  let message = '';
  message +=
    assignmentDetails?.additions?.length > 0
      ? (keywordsKeys && keywordsKeys['addMessageFormRequest']
          ? keywordsKeys['addMessageFormRequest']
          : `Please add the following dataset on the org unit`) +
        `: ${
          assignmentDetails?.organisationUnit?.name +
          ' - ' +
          assignmentDetails?.organisationUnit?.parent?.name +
          (assignmentDetails?.organisationUnit?.parent?.parent &&
          assignmentDetails?.organisationUnit?.parent?.parent?.name
            ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
            : '')
        } \n` +
        assignmentDetails?.additions
          .map((addition, index) => {
            const dataSetAttributesDataInfo =
              assignmentDetails?.dataSetAttributesData?.filter(
                (attrInfo) => attrInfo?.dataSet?.id === addition?.id
              ) || [];
            return (
              index +
              1 +
              '. ' +
              addition?.name +
              (dataSetAttributesDataInfo?.length > 0
                ? ' (' +
                  formulateFormAttributeMessage(
                    dataSetAttributesDataInfo,
                    addition,
                    keywordsKeys
                  ) +
                  ')'
                : '')
            );
          })
          .join(',\n')
      : '';

  message += assignmentDetails?.additions?.length > 0 ? '\n\n' : '';

  message +=
    assignmentDetails?.deletions?.length > 0
      ? (keywordsKeys && keywordsKeys['removeMessageFormRequest']
          ? keywordsKeys['removeMessageFormRequest']
          : `Naomba kuondolewa fomu zifuatazo kwenye kituo`) +
        `: ${
          assignmentDetails?.organisationUnit?.name +
          ' - ' +
          assignmentDetails?.organisationUnit?.parent?.name +
          (assignmentDetails?.organisationUnit?.parent?.parent &&
          assignmentDetails?.organisationUnit?.parent?.parent?.name
            ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
            : '')
        } \n` +
        assignmentDetails?.deletions
          .map((deletion, index) => {
            const dataSetAttributesDataInfo =
              assignmentDetails?.dataSetAttributesData?.filter(
                (attrInfo) => attrInfo?.dataSet?.id === deletion?.id
              ) || [];
            return (
              index +
              1 +
              '. ' +
              deletion?.name +
              (dataSetAttributesDataInfo?.length > 0
                ? ' (' +
                  formulateFormAttributeMessage(
                    dataSetAttributesDataInfo,
                    deletion,
                    keywordsKeys
                  ) +
                  ')'
                : '')
            );
          })
          .join(',\n')
      : '';
  return {
    subject:
      assignmentDetails?.ticketNumber +
      ' - ' +
      (keywordsKeys && keywordsKeys['messageRequestHeader']
        ? keywordsKeys['formRequestMessageHeaderKey']
        : 'MAOMBI YA FOMU'),
    message,
  };
}

export function constructMessageForDataSetAssignment(
  assignmentDetails: any,
  keywordsKeys: any
) {
  let message = '';
  message +=
    assignmentDetails?.additions?.length > 0
      ? (keywordsKeys && keywordsKeys['addMessageFacilitiesFormRequestKey']
          ? keywordsKeys['addMessageFacilitiesFormRequestKey']
          : `Naomba kuongezewa vituo vifuatavyo kwenye fomu `) +
        `${assignmentDetails?.dataSet?.name}:- \n` +
        assignmentDetails?.additions
          .map((addition, index) => {
            return index + 1 + '. ' + addition?.name;
          })
          .join(',\n')
      : '';

  message += assignmentDetails?.additions?.length > 0 ? '\n\n' : '';
  message +=
    assignmentDetails?.deletions?.length > 0
      ? (keywordsKeys && keywordsKeys['removeMessageFacilitiesFormRequestKey']
          ? keywordsKeys['removeMessageFacilitiesFormRequestKey']
          : `Naomba kuondolewa vituo vifuatavyo kwenye fomu `) +
        `${assignmentDetails?.dataSet?.name} \n` +
        assignmentDetails?.deletions
          .map((deletion, index) => {
            return index + 1 + '. ' + deletion?.name;
          })
          .join(',\n')
      : '';
  return {
    subject:
      assignmentDetails?.ticketNumber +
      ' - ' +
      (keywordsKeys && keywordsKeys['messageRequestHeader']
        ? keywordsKeys['formRequestMessageHeaderKey']
        : 'MAOMBI YA FOMU'),
    message,
  };
}

export function getDataStoreDetailsForFormRequestsByDataSet(
  assignmentDetails: any,
  keywordsKeys: any
): any {
  let action = '';
  action +=
    assignmentDetails?.deletions?.length > 0
      ? (keywordsKeys && keywordsKeys['Remove']
          ? keywordsKeys['Remove']
          : 'Remove') +
        ' ' +
        assignmentDetails?.deletions?.length +
        (keywordsKeys && keywordsKeys['organisationunits from']
          ? ' ' + keywordsKeys['organisationunits from'] + ' '
          : ' organisationunits from ') +
        assignmentDetails?.dataSet?.name
      : '';

  action +=
    assignmentDetails?.deletions?.length > 0 &&
    assignmentDetails?.additions?.length > 0
      ? ' ' +
        (keywordsKeys && keywordsKeys['and'] ? keywordsKeys['and'] : 'and') +
        ' '
      : '';

  action +=
    assignmentDetails?.additions?.length > 0
      ? (keywordsKeys && keywordsKeys['Assign']
          ? keywordsKeys['Assign']
          : 'Assign') +
        ' ' +
        assignmentDetails?.additions?.length +
        (keywordsKeys && keywordsKeys['organisationunits to']
          ? ' ' + keywordsKeys['organisationunits to']
          : 'organisationunits to') +
        ' ' +
        assignmentDetails?.dataSet?.name
      : '';

  let replyMessage = '';
  replyMessage +=
    assignmentDetails?.deletions?.length > 0
      ? (keywordsKeys && keywordsKeys['Removed']
          ? keywordsKeys['Removed']
          : 'Removed') +
        ' ' +
        assignmentDetails?.deletions?.length +
        (keywordsKeys && keywordsKeys['organisationunits from the form']
          ? ' ' + keywordsKeys['organisationunits from the form']
          : ' organisationunits from the form') +
        ' ' +
        assignmentDetails?.dataSet?.name
      : '';

  replyMessage +=
    assignmentDetails?.deletions?.length > 0 &&
    assignmentDetails?.additions?.length > 0
      ? (keywordsKeys && keywordsKeys['and']
          ? ' ' + keywordsKeys['and']
          : ' and') + ' '
      : '';

  replyMessage +=
    assignmentDetails?.additions?.length > 0
      ? (keywordsKeys && keywordsKeys['Assigned']
          ? keywordsKeys['Assigned']
          : 'Assigned') +
        ' ' +
        assignmentDetails?.additions?.length +
        (keywordsKeys && keywordsKeys['organisationunits to the form']
          ? ' ' + keywordsKeys['organisationunits to the form']
          : ' organisationunits to the form') +
        ' ' +
        assignmentDetails?.dataSet?.name
      : '';

  return {
    action: action,
    replyMessage: replyMessage,
    ticketNumber: assignmentDetails?.ticketNumber,
    method: 'POST',
    payload: {
      deletions:
        assignmentDetails?.deletions?.length > 0
          ? assignmentDetails?.deletions.map((deletion) => {
              return {
                id: deletion?.id,
                name: deletion?.name,
              };
            })
          : [],
      additions:
        assignmentDetails?.additions?.length > 0
          ? assignmentDetails?.additions.map((addition) => {
              return {
                id: addition?.id,
                name: addition?.name,
              };
            })
          : [],
    },
    url: `dataSets/${
      assignmentDetails?.dataSet?.id
    }/organisationUnits.json?cache=${assignmentDetails?.ticketNumber.replace(
      'DS',
      ''
    )}`,
  };
}

export function getDataStoreDetailsForFormRequests(
  assignmentDetails: any,
  keywordsKeys
): any {
  let action = '';
  action +=
    assignmentDetails?.deletions?.length > 0
      ? (keywordsKeys && keywordsKeys['Remove']
          ? keywordsKeys['Remove']
          : 'Remove') +
        ' ' +
        assignmentDetails?.deletions?.length +
        (keywordsKeys && keywordsKeys['datasets from']
          ? keywordsKeys['datasets from']
          : ' datasets from') +
        '  ' +
        assignmentDetails?.organisationUnit?.name +
        ' - ' +
        assignmentDetails?.organisationUnit?.parent?.name +
        (assignmentDetails?.organisationUnit?.parent?.parent &&
        assignmentDetails?.organisationUnit?.parent?.parent?.name
          ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
          : '')
      : '';

  action +=
    assignmentDetails?.deletions?.length > 0 &&
    assignmentDetails?.additions?.length > 0
      ? ' ' +
        (keywordsKeys && keywordsKeys['and'] ? keywordsKeys['and'] : 'and') +
        ' '
      : '';

  action +=
    assignmentDetails?.additions?.length > 0
      ? (keywordsKeys && keywordsKeys['Assign']
          ? keywordsKeys['Assign']
          : 'Assign') +
        ' ' +
        assignmentDetails?.additions?.length +
        ' ' +
        (keywordsKeys && keywordsKeys['datasets to']
          ? keywordsKeys['datasets to']
          : 'datasets to') +
        ' ' +
        assignmentDetails?.organisationUnit?.name +
        ' - ' +
        assignmentDetails?.organisationUnit?.parent?.name +
        (assignmentDetails?.organisationUnit?.parent?.parent &&
        assignmentDetails?.organisationUnit?.parent?.parent?.name
          ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
          : '')
      : '';

  let replyMessage = '';
  replyMessage +=
    assignmentDetails?.deletions?.length > 0
      ? (keywordsKeys && keywordsKeys['Removed']
          ? keywordsKeys['Removed']
          : 'Removed') +
        ' ' +
        assignmentDetails?.deletions?.length +
        ' ' +
        (keywordsKeys && keywordsKeys['datasets from']
          ? keywordsKeys['datasets from']
          : 'datasets from') +
        ' ' +
        assignmentDetails?.organisationUnit?.name +
        ' - ' +
        assignmentDetails?.organisationUnit?.parent?.name +
        (assignmentDetails?.organisationUnit?.parent?.parent &&
        assignmentDetails?.organisationUnit?.parent?.parent?.name
          ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
          : '')
      : '';

  replyMessage +=
    assignmentDetails?.deletions?.length > 0 &&
    assignmentDetails?.additions?.length > 0
      ? ' ' +
        (keywordsKeys && keywordsKeys['and'] ? keywordsKeys['and'] : 'and') +
        ' '
      : '';

  replyMessage +=
    assignmentDetails?.additions?.length > 0
      ? (keywordsKeys && keywordsKeys['Assigned']
          ? keywordsKeys['Assigned']
          : 'Assigned') +
        ' ' +
        assignmentDetails?.additions?.length +
        ' ' +
        (keywordsKeys && keywordsKeys['datasets to']
          ? keywordsKeys['datasets to']
          : 'datasets to') +
        ' ' +
        assignmentDetails?.organisationUnit?.name +
        ' - ' +
        assignmentDetails?.organisationUnit?.parent?.name +
        (assignmentDetails?.organisationUnit?.parent?.parent &&
        assignmentDetails?.organisationUnit?.parent?.parent?.name
          ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
          : '')
      : '';

  return action && action?.length > 5
    ? {
        action: action,
        replyMessage: replyMessage,
        ticketNumber: assignmentDetails?.ticketNumber,
        method: 'POST',
        payload: {
          deletions:
            assignmentDetails?.deletions?.length > 0
              ? assignmentDetails?.deletions.map((deletion) => {
                  return {
                    id: deletion?.id,
                    name: deletion?.name,
                  };
                })
              : [],
          additions:
            assignmentDetails?.additions?.length > 0
              ? assignmentDetails?.additions.map((addition) => {
                  return {
                    id: addition?.id,
                    name: addition?.name,
                  };
                })
              : [],
          dataSetAttributesData: assignmentDetails?.dataSetAttributesData,
        },
        url: `organisationUnits/${
          assignmentDetails?.organisationUnit?.id
        }/dataSets.json?cache=${assignmentDetails?.ticketNumber.replace(
          'DS',
          ''
        )}`,
      }
    : null;
}

export function formulateFormAttributeMessage(
  dataSetAttributesDataInfo: any[],
  dataSet: any,
  keywordsKeys: any
): string {
  const dataSetAttributesData =
    dataSetAttributesDataInfo?.filter(
      (attrInfo) => attrInfo?.dataSet?.id === dataSet?.id
    ) || [];
  if (dataSetAttributesData?.length > 0) {
    const additions = dataSetAttributesData
      ?.map((attributeDataInfo) => {
        if (attributeDataInfo?.additions?.length > 0) {
          return attributeDataInfo?.categoryOption;
        }
      })
      ?.filter((addition) => addition);

    const deletions = dataSetAttributesData
      ?.map((attributeDataInfo) => {
        if (attributeDataInfo?.deletions?.length > 0) {
          return attributeDataInfo?.categoryOption;
        }
      })
      ?.filter((deletion) => deletion);
    return (
      (additions?.length > 0
        ? (keywordsKeys && keywordsKeys['Add'] ? keywordsKeys['Add'] : 'Add') +
          ': ' +
          additions?.map((addition) => addition?.name).join(',')
        : '') +
      (deletions?.length > 0
        ? ' ' +
          (keywordsKeys && keywordsKeys['Remove']
            ? keywordsKeys['Remove']
            : 'Remove') +
          ': ' +
          deletions?.map((deletion) => deletion?.name).join(',')
        : '')
    );
  } else {
    return null;
  }
}
