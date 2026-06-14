/**
 * MentionInput
 *
 * Input/Textarea hỗ trợ nhắc tên user (@mention) dùng react-mentions.
 *
 * Nguyên lý hoạt động:
 *  - Parent truyền/nhận PLAIN TEXT ("hello @john")
 *  - Component tự quản lý markupValue nội bộ ("hello @[john](john)")
 *    vì react-mentions yêu cầu value đúng markup format
 *  - Khi parent reset value về "" (sau submit), markupValue cũng reset
 *  - BE parse mention bằng regex: /@([a-zA-Z0-9_.]{3,100})/g
 *
 * ⚠️  Không dùng overflow-hidden trên wrapperClassName —
 *     suggestions popup là con của MentionsInput và sẽ bị cắt mất.
 */
import { useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { useMentionUsers } from "@/hooks/useMentionUsers";

// ─── Styles ───────────────────────────────────────────────────────────────────

const suggestionsStyle = {
  zIndex: 9999,
  list: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0/0.1), 0 2px 4px -2px rgb(0 0 0/0.1)",
    overflow: "hidden",
    maxHeight: "200px",
    overflowY: "auto",
    fontSize: "0.875rem",
    minWidth: "180px",
  },
  item: {
    padding: "8px 12px",
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
    "&focused": { backgroundColor: "#fef3c7" },
  },
};

const singleLineStyle = {
  control: {
    fontSize: "0.875rem",
    lineHeight: "1.5",
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
    color: "#334155", // Màu chữ bình thường (slate-700)
  },
  "&singleLine": {
    display: "block",
    width: "100%",
    height: "100%",
    highlighter: {
      height: "100%",
      padding: "9px 1rem",
      border: "none",
      boxSizing: "border-box",
      overflow: "hidden",
      substring: {
        visibility: "visible",
        color: "#334155",
      },
    },
    input: {
      height: "100%",
      padding: "9px 1rem",
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      boxSizing: "border-box",
      color: "transparent", // Ẩn chữ của input
      caretColor: "#334155", // Vẫn giữ con trỏ chuột màu đen
    },
  },
  suggestions: suggestionsStyle,
};

const multiLineStyle = {
  control: {
    fontSize: "0.875rem",
    lineHeight: "1.5",
    backgroundColor: "transparent",
    color: "#334155",
  },
  "&multiLine": {
    control: { minHeight: "72px" },
    highlighter: {
      padding: "0.5rem 0.75rem",
      border: "none",
      boxSizing: "border-box",
      substring: {
        visibility: "visible",
        color: "#334155",
      },
    },
    input: {
      padding: "0.5rem 0.75rem",
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      boxSizing: "border-box",
      resize: "none",
      color: "transparent",
      caretColor: "#334155",
    },
  },
  suggestions: suggestionsStyle,
};

// ─── SuggestionItem ───────────────────────────────────────────────────────────
function SuggestionItem({ suggestion, focused }) {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer px-3 py-2 ${
        focused ? "bg-amber-50" : ""
      }`}
    >
      <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-xs text-slate-500 font-semibold">
        {suggestion.avatar ? (
          <img
            src={suggestion.avatar}
            alt={suggestion.display}
            className="h-full w-full object-cover"
          />
        ) : (
          suggestion.display?.[0]?.toUpperCase()
        )}
      </div>
      <span className="text-sm font-medium text-slate-700">@{suggestion.display}</span>
    </div>
  );
}

export function getPlainTextFromMarkup(markup) {
  if (!markup) return "";
  return markup.replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1');
}

// ─── MentionInput ─────────────────────────────────────────────────────────────
export default function MentionInput({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  multiLine = false,
  rows,
  wrapperClassName = "",
  onMentionsChange,
}) {
  const users = useMentionUsers();

  // Markup format nội bộ của react-mentions: "@[name](name)"
  const [markupValue, setMarkupValue] = useState(value);

  // Track giá trị prop trước đó để reset hoặc cập nhật từ parent
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setMarkupValue(value);
  }

  function handleChange(_event, newMarkup, newPlainText, mentions) {
    setMarkupValue(newMarkup);
    // Gửi markup ra ngoài để parent quản lý state chính xác
    onChange?.({ target: { value: newMarkup } });
    // Gửi danh sách user IDs đang được nhắc tới (dùng số thực, không phải username)
    if (onMentionsChange) {
      const ids = mentions.map((m) => Number(m.id));
      onMentionsChange(ids);
    }
  }

  return (
    <div className={`relative ${wrapperClassName}`}>
      <MentionsInput
        value={markupValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        singleLine={!multiLine}
        rows={rows}
        allowSpaceInQuery
        allowSuggestionsAboveCursor
        appendSpaceOnAdd
        style={multiLine ? multiLineStyle : singleLineStyle}
        className="w-full h-full"
        classNames={{
          control: "mention-input__control",
          highlighter: "mention-input__highlighter",
          input: "mention-input__input",
        }}
        a11ySuggestionsListLabel="Gợi ý người dùng"
      >
        <Mention
          className="mention-highlighted-text"
          trigger="@"
          markup="@[__display__](__id__)"
          data={users}
          // Dùng text color thay background — dễ nhìn hơn, sạch hơn
          style={{ color: "#d97706" }}
          displayTransform={(_id, display) => `@${display}`}
          renderSuggestion={(suggestion, _search, _highlighted, _index, focused) => (
            <SuggestionItem suggestion={suggestion} focused={focused} />
          )}
        />
      </MentionsInput>
    </div>
  );
}
