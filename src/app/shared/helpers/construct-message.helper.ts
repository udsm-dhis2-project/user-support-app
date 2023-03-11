export function constructMessageForFacilityAssignment(assignmentDetails: any) {
  let message = '';
  message +=
    assignmentDetails?.additions?.length > 0
      ? `Naomba kuongezewa fomu zifuatazo kwenye kituo: ${
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
                    addition
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
      ? `Naomba kuondolewa fomu zifuatazo kwenye kituo: ${
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
                    deletion
                  ) +
                  ')'
                : '')
            );
          })
          .join(',\n')
      : '';
  return {
    subject: assignmentDetails?.ticketNumber + ' - MAOMBI YA FOMU',
    message,
  };
}

export function constructMessageForDataSetAssignment(assignmentDetails: any) {
  let message = '';
  message +=
    assignmentDetails?.additions?.length > 0
      ? `Naomba kuongezewa vituo vifuatavyo kwenye fomu ${assignmentDetails?.dataSet?.name}:- \n` +
        assignmentDetails?.additions
          .map((addition, index) => {
            return index + 1 + '. ' + addition?.name;
          })
          .join(',\n')
      : '';

  message += assignmentDetails?.additions?.length > 0 ? '\n\n' : '';
  message +=
    assignmentDetails?.deletions?.length > 0
      ? `Naomba kuondolewa vituo vifuatavyo kwenye fomu ${assignmentDetails?.dataSet?.name} \n` +
        assignmentDetails?.deletions
          .map((deletion, index) => {
            return index + 1 + '. ' + deletion?.name;
          })
          .join(',\n')
      : '';
  return {
    subject: assignmentDetails?.ticketNumber + ' - MAOMBI YA FOMU',
    message,
  };
}

export function getDataStoreDetailsForFormRequestsByDataSet(
  assignmentDetails: any
): any {
  let action = '';
  action +=
    assignmentDetails?.deletions?.length > 0
      ? 'Remove ' +
        assignmentDetails?.deletions?.length +
        ' organisationunits from ' +
        assignmentDetails?.dataSet?.name
      : '';

  action +=
    assignmentDetails?.deletions?.length > 0 &&
    assignmentDetails?.additions?.length > 0
      ? ' and '
      : '';

  action +=
    assignmentDetails?.additions?.length > 0
      ? 'Assign ' +
        assignmentDetails?.additions?.length +
        ' organisationunits to ' +
        assignmentDetails?.dataSet?.name
      : '';

  let replyMessage = '';
  replyMessage +=
    assignmentDetails?.deletions?.length > 0
      ? 'Removed ' +
        assignmentDetails?.deletions?.length +
        ' organisationunits from the form ' +
        assignmentDetails?.dataSet?.name
      : '';

  replyMessage +=
    assignmentDetails?.deletions?.length > 0 &&
    assignmentDetails?.additions?.length > 0
      ? ' and '
      : '';

  replyMessage +=
    assignmentDetails?.additions?.length > 0
      ? 'Assigned ' +
        assignmentDetails?.additions?.length +
        ' organisationunits to the form ' +
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
  assignmentDetails: any
): any {
  let action = '';
  action +=
    assignmentDetails?.deletions?.length > 0
      ? 'Remove ' +
        assignmentDetails?.deletions?.length +
        ' datasets from ' +
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
      ? ' and '
      : '';

  action +=
    assignmentDetails?.additions?.length > 0
      ? 'Assign ' +
        assignmentDetails?.additions?.length +
        ' datasets to ' +
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
      ? 'Removed ' +
        assignmentDetails?.deletions?.length +
        ' datasets from ' +
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
      ? ' and '
      : '';

  replyMessage +=
    assignmentDetails?.additions?.length > 0
      ? 'Assigned ' +
        assignmentDetails?.additions?.length +
        ' datasets to ' +
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
  dataSet: any
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
        ? 'Add: ' + additions?.map((addition) => addition?.name).join(',')
        : '') +
      (deletions?.length > 0
        ? ' Remove: ' + deletions?.map((deletion) => deletion?.name).join(',')
        : '')
    );
  } else {
    return null;
  }
}
