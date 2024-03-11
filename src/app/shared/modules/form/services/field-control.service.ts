import { Injectable } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Field } from "../models/field.model";
import { FieldsData } from "../models/fields-data.model";

@Injectable({ providedIn: "root" })
export class FieldControlService {
  constructor() {}

  toFormGroup(fields: Field<string>[], fieldsData?: FieldsData): UntypedFormGroup {
    const group: any = {};
    fields.forEach((field) => {
      const fieldData = fieldsData ? fieldsData[field.id]?.latest : null;
      if (field?.key) {
        group[field.key] = field.required
          ? new UntypedFormControl(
              {
                value: fieldData?.value || field.value || "",
                disabled: field?.disabled,
              },
              Validators.required
            )
          : new UntypedFormControl({
              value: fieldData?.value || field.value || "",
              disabled: field?.disabled,
            });
      }
    });

    return new UntypedFormGroup(group);
  }
}
