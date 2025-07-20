import React, { useRef, useState, useEffect } from 'react';
import {
  useForm,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import './schemaBuilder.css';

// FieldEditor Component
const FieldEditor = ({
  namePrefix,
  control,
  register,
  setValue,
  watch,
  isRoot = false,
}) => {
  const fieldArrayName = isRoot ? namePrefix : `${namePrefix}.children`;

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName,
  });

  const watchedFields = useWatch({ control, name: fieldArrayName }) ?? [];

  const canAddField =
    watchedFields.length === 0 ||
    watchedFields[watchedFields.length - 1]?.key?.trim() !== '';

  useEffect(() => {
    watchedFields.forEach((item, index) => {
      const base = `${fieldArrayName}[${index}]`;
      const type = item?.type;

      if (type === 'nested' && !item.children) {
        setValue(`${base}.children`, []);
      }

      if (type !== 'nested' && item?.children) {
        setValue(`${base}.children`, undefined);
      }
    });
  }, [watchedFields, setValue, fieldArrayName]);

 return (
  <div className="field-editor glow-hover px-4 py-6 space-y-4 max-w-full overflow-x-hidden ">
    {fields.map((item, index) => {
      const base = `${fieldArrayName}[${index}]`;
      const typeName = `${base}.type`;
      const type = watch(typeName);

      return (
        <div
          key={item.id}
          className="field-item flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white/10 p-4 rounded-lg shadow-sm max-w-full overflow-x-auto"
        >
          <input
            placeholder="Field Name"
            {...register(`${base}.key`)}
            className="input flex-1 px-3 py-2 rounded border border-gray-300 bg-white/90 text-black min-w-0"
          />

          <select
            {...register(typeName)}
            className="select px-3 py-2 rounded border border-gray-300 bg-white/90 text-black"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="nested">Nested</option>
          </select>

          <button
            type="button"
            onClick={() => remove(index)}
            className="delete-btn text-red-600 hover:text-red-800 text-lg"
          >
            ❌
          </button>

          {type === 'nested' && (
            <div className="w-full mt-4 pl-4 border-l-2 border-blue-400">
              <FieldEditor
                namePrefix={base}
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
              />
            </div>
          )}
        </div>
      );
    })}

    <div className="add-btn-wrapper flex justify-center">
      <button
        type="button"
        onClick={() => append({ key: '', type: 'string' })}
        disabled={!canAddField}
        className={`add-btn mt-4 px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${
          canAddField ? '' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        ➕ Add Field
      </button>
    </div>
  </div>
);
};
// LivePreview Component
const LivePreview = ({ schema }) => {
  if (!schema || typeof schema !== 'object') return null;

  const renderField = (key, value) => {
    if (typeof value === 'string') {
      return (
        <div key={key} style={{ marginBottom: '6px' }}>
          {key}: <input placeholder={value} />
        </div>
      );
    } else if (typeof value === 'object') {
      return (
        <div key={key} style={{ margin: '10px 0 10px 20px' }}>
          <strong>{key}:</strong>
          <div style={{ marginLeft: '15px' }}>
            {Object.entries(value).map(([k, v]) => renderField(k, v))}
          </div>
        </div>
      );
    }
    return null;
  };

  return <div className="preview-box  glow-hover">{Object.entries(schema).map(([k, v]) => renderField(k, v))}</div>;
};

// Main SchemaBuilder Component
const SchemaBuilder = () => {
  const {
    control,
    register,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: { fields: [] },
  });

  const fields = useWatch({ control, name: 'fields' }) ?? [];
  const [fileName, setFileName] = useState('schema');
  const [fileType, setFileType] = useState('json');
  const fileInputRef = useRef(null);

  const buildSchema = (fields) => {
    const result = {};
    fields
      .filter((field) => field.key && field.key.trim() !== '')
      .forEach((field) => {
        const key = field.key.trim();
        if (field.type === 'nested') {
          result[key] = buildSchema(field.children || []);
        } else {
          result[key] = field.type;
        }
      });
    return result;
  };

  const schema = buildSchema(fields);
  const schemaText =
    fileType === 'json'
      ? JSON.stringify(schema, null, 2)
      : `const schema = ${JSON.stringify(schema, null, 2)};`;

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(schemaText);
    alert('Copied to clipboard!');
  };

  const handleDownloadToFile = () => {
    const extension = fileType === 'json' ? 'json' : fileType;
    const blob = new Blob([schemaText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${fileName}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSchema = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        const convertToFields = (obj) =>
          Object.entries(obj).map(([k, v]) => {
            if (typeof v === 'string') {
              return { key: k, type: v };
            } else {
              return {
                key: k,
                type: 'nested',
                children: convertToFields(v),
              };
            }
          });

        reset({ fields: convertToFields(json) });
        alert('Schema imported!');
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="builder-container  ">
    <h2 style={{
  fontSize: '45px',
  fontWeight: '700',         // bold
  textAlign: 'center',       // center the text
  color: '#f5f5f5',          // off-white
  marginBottom: '1.5rem'
}}>
  🛠 JSON Schema Builder
</h2>
      <div className="main-builder">
        <FieldEditor
          namePrefix="fields"
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
          isRoot
        />

        <div className="schema-box glow-hover">
         <h3
  style={{
    fontSize: '1.2rem',
    fontWeight: '700',
    textAlign: 'center',
    color: '#f5f5f5',
    marginTop: '1rem',
    marginBottom: '1rem',
    letterSpacing: '0.03em'
  }}
>
  📄 Generated Schema:
</h3>

          <pre>{schemaText}</pre>

          <div className="button-row">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File name"
            />
<select
  value={fileType}
  onChange={(e) => setFileType(e.target.value)}
  className="styled-select"
>
  <option value="json">.json</option>
  <option value="jsx">.jsx</option>
  <option value="ts">.ts</option>
</select>

           <div className="action-buttons">
  <button className="glow-button" onClick={handleCopyToClipboard}>📋 Copy</button>
  <button className="glow-button" onClick={handleDownloadToFile}>💾 Save</button>
</div>

          </div>

        <label className="import-label">
  📂 Import Schema:
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleImportSchema}
    accept=".json"
    className="file-input"
  />
</label>

        </div>
      </div>

    <h3
  style={{
    fontSize: '2rem',
    fontWeight: 700,
    color: '#f5f5f5',
    textAlign: 'center',
    margin: '2rem 0 1.25rem 0'
  }}
>
  👁️ Live Preview:
</h3>

      <LivePreview schema={schema} />
    </div>
  );
};

export default SchemaBuilder;
