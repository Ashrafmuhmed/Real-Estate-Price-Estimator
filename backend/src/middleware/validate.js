export default function validate(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message);
      return next({ statusCode: 400, message: "Validation failed", details: messages });
    }

    req.validatedBody = value;
    next();
  };
}
