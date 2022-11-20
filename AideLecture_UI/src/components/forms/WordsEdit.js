import React from "react";
import { DJANGO_API_URL } from "../../apis/djangoApi";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";

const WordsEdit = (props) => {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: "words",
  });

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-primary mb-3"
        onClick={() => props.onHandleClick(getValues("answers"))}
      >
        Décomposer la question
      </button>
      <ul className="list-group list-group-flush mb-4">
        {fields.map((field, index) => {
          let position = index + 1;
          return (
            <li key={field.id} className="list-group-item">
              <div className="row">
                <div className="col-1">{position}</div>
                <div className="col-4">
                  <label className="form-label"></label>
                  <Controller
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${
                          errors && errors.words && errors.words[index]
                            ? "is-invalid"
                            : ""
                        }`}
                        autoComplete="off"
                      />
                    )}
                    defaultValue={field.statement}
                    name={`words[${index}].statement`}
                    control={control}
                  />
                  {errors && errors.words && errors.words[index] && (
                    <div className="invalid-feedback">
                      {errors.words[index].statement.message}
                    </div>
                  )}
                </div>
                <div className="col-2">
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
                <div className="col-5">
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
                    name={`words[${index}].image`}
                    control={control}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default WordsEdit;
