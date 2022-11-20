import React from "react";
import { DJANGO_API_URL } from "../../apis/djangoApi";
import ActionButton from "../forms/buttons/ActionButton";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";

const Answers = () => {
  const audioFiles = [];
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
        if (field.audio) {
          audioFiles[index] = new Audio(`${DJANGO_API_URL}${field.audio}`);
        }

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
              <div className="col-2">
                <div className="row">
                  {audioFiles.length > 0 && field.audio && (
                    <ActionButton
                      icon="volume-high"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        audioFiles[index].play();
                      }}
                    />
                  )}
                  {field.filename && (
                    <img
                      key={index}
                      width="80px"
                      height="80px"
                      src={`${DJANGO_API_URL}${field.filename}`}
                      alt={field.statement}
                    />
                  )}
                </div>
              </div>
              <div className="col-4">
                <label className="form-label">Fichier d'image</label>
                <Controller
                  render={({ field }) => (
                    <input
                      {...field}
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/png,image/gif"
                    />
                  )}
                  defaultValue={field.image ? field.image : ""}
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
