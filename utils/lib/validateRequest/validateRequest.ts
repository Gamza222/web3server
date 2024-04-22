import { Request, Response } from 'express';

export function validateRequest(
  req: Request,
  res: Response,
  requiredFields: string[],
  optionalFields?: string[],
) {
  const notAllowedValues: string[] = [];
  const missingValues: string[] = [];
  //checks if field is missing
  for (const field of requiredFields) {
    !req.body[field] ? missingValues.push(field) : '';
  }
  //checks if not required field is present
  const allFields = optionalFields
    ? requiredFields.concat(optionalFields)
    : requiredFields;

  for (const field in req.body) {
    const notValid = Object.keys(req.body).find(
      (name: string) => name !== field,
    );
    allFields.indexOf(field) == -1 ? notAllowedValues.push(field) : '';
  }

  //returns request
  if (notAllowedValues.length > 0) {
    res.status(401).json({
      data: null,
      error: true,
      errMessage: `Field '${notAllowedValues.map(
        value => value,
      )}' is not allowed.`,
    });
    res.end();
    return true;
  } else if (missingValues.length > 0) {
    res.status(401).json({
      data: null,
      error: true,
      errMessage: `Fields '${missingValues.map(value => value)}' is required.`,
    });
    return true;
  }
  return false;
}
