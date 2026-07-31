import "./StatCard.css";

function StatCard({ title, value, icon }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <span>{title}</span>
                <span className="stat-card-icon">{icon}</span>
            </div>

            <h2>{value}</h2>
        </div>
    );
}

export default StatCard;