import React from "react";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";

const Answers = () => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: "answers",
  });

  return (
    <>
      <h4>Réponses :</h4>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="input-group mb-4">
            <div className="row">
              <div className="col-1 form-check">
                <input
                  name="rightAnswer"
                  type="radio"
                  value={index}
                  className="form-check-input"
                  onClick={(e) => {
                    setValue("rightAnswer", e.target.value);
                  }}
                  {...register("rightAnswer")}
                />
              </div>
              <div className="col-5">
                <label className="form-label">Énoncé</label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`form-control ${
                        errors && errors.answers && errors.answers[index]
                          ? "is-invalid"
                          : ""
                      }`}
                      autoComplete="off"
                    />
                  )}
                  defaultValue={field.statement}
                  name={`answers[${index}].statement`}
                  control={control}
                />
                {errors && errors.answers && errors.answers[index] && (
                  <div className="invalid-feedback">
                    {errors.answers[index].statement.message}
                  </div>
                )}
              </div>
              <div className="col-1"></div>
              <div className="col-5">
                <label className="form-label">Fichier d'image</label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="form-control"
                      autoComplete="off"
                    />
                  )}
                  defaultValue={field.image}
                  name={`answers[${index}].image`}
                  control={control}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Answers;
