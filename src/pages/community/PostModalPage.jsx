import { useParams, useNavigate } from "react-router-dom";
import CommunityPostDetailModal from "@/components/user/community/CommunityPostDetailModal";

export default function PostModalPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <CommunityPostDetailModal
      postId={id}
      onClose={() => navigate("/community")}
    />
  );
}
